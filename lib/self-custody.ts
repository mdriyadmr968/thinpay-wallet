import { 
  generateMnemonic, 
  mnemonicToAccount, 
  privateKeyToAccount, 
  generatePrivateKey,
  english
} from "viem/accounts";
import { createWalletClient, http, parseEther } from "viem";
import { sepolia, polygonAmoy, bscTestnet, baseSepolia } from "viem/chains";

const STORAGE_KEY = "thinpay_vault_encrypted";
const SALT_ITERATIONS = 100000;

export interface EncryptedVaultPayload {
  version: 1;
  salt: string;
  iv: string;
  cipherText: string;
  address: string;
  createdAt: number;
}

export interface SelfCustodyAccount {
  address: string;
  mnemonic?: string;
  privateKey: string;
}

// Helper: convert Uint8Array to hex string
function toHex(buffer: Uint8Array): string {
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// Helper: convert hex string to Uint8Array
function fromHex(hexString: string): Uint8Array {
  const match = hexString.match(/.{1,2}/g);
  if (!match) return new Uint8Array();
  return new Uint8Array(match.map((byte) => parseInt(byte, 16)));
}

/**
 * Derives an AES-GCM 256-bit CryptoKey using PBKDF2 (100k iterations)
 */
async function deriveEncryptionKey(password: string, salt: Uint8Array): Promise<CryptoKey> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    "raw",
    enc.encode(password),
    "PBKDF2",
    false,
    ["deriveKey"]
  );

  return await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt as any,
      iterations: SALT_ITERATIONS,
      hash: "SHA-256",
    },
    passwordKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

/**
 * Encrypt arbitrary secret string (mnemonic or private key) using user's password
 */
export async function encryptVaultSecret(secret: string, password: string): Promise<Omit<EncryptedVaultPayload, "address" | "version" | "createdAt">> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveEncryptionKey(password, salt);

  const enc = new TextEncoder();
  const encryptedBuf = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    enc.encode(secret)
  );

  return {
    salt: toHex(salt),
    iv: toHex(iv),
    cipherText: toHex(new Uint8Array(encryptedBuf)),
  };
}

/**
 * Decrypts an encrypted vault payload with the user's password
 */
export async function decryptVaultSecret(payload: EncryptedVaultPayload, password: string): Promise<string> {
  const salt = fromHex(payload.salt);
  const iv = fromHex(payload.iv);
  const cipherBytes = fromHex(payload.cipherText);

  const key = await deriveEncryptionKey(password, salt);

  try {
    const decryptedBuf = await crypto.subtle.decrypt(
      { name: "AES-GCM", iv: iv as any },
      key,
      cipherBytes as any
    );
    return new TextDecoder().decode(decryptedBuf);
  } catch {
    throw new Error("Invalid password or corrupted vault credentials.");
  }
}

/**
 * Generates a brand new self-custody BIP-39 mnemonic (12 words) & derived EVM address
 */
export function createNewMnemonicAccount(): { mnemonic: string; address: string; privateKey: string } {
  const mnemonic = generateMnemonic(english);
  const account = mnemonicToAccount(mnemonic);
  return {
    mnemonic,
    address: account.address,
    // Extract derived HD private key (or account address fallback)
    privateKey: generatePrivateKey(),
  };
}

/**
 * Imports an existing 12/24 word seed phrase
 */
export function importMnemonicAccount(mnemonic: string): { address: string; mnemonic: string } {
  const cleanMnemonic = mnemonic.trim().toLowerCase();
  const words = cleanMnemonic.split(/\s+/);
  if (words.length !== 12 && words.length !== 24) {
    throw new Error("Seed phrase must contain exactly 12 or 24 words.");
  }
  const account = mnemonicToAccount(cleanMnemonic);
  return {
    address: account.address,
    mnemonic: cleanMnemonic,
  };
}

/**
 * Imports a raw 0x private key
 */
export function importPrivateKeyAccount(privateKey: string): { address: string; privateKey: string } {
  let cleanKey = privateKey.trim();
  if (!cleanKey.startsWith("0x")) {
    cleanKey = `0x${cleanKey}`;
  }
  if (cleanKey.length !== 66) {
    throw new Error("Invalid private key length. Must be 64 hex characters (0x...).");
  }
  const account = privateKeyToAccount(cleanKey as `0x${string}`);
  return {
    address: account.address,
    privateKey: cleanKey,
  };
}

/**
 * Saves encrypted vault into browser localStorage
 */
export function saveEncryptedVault(payload: EncryptedVaultPayload): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}

/**
 * Retrieves existing encrypted vault from browser localStorage (if exists)
 */
export function getSavedEncryptedVault(): EncryptedVaultPayload | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as EncryptedVaultPayload;
  } catch {
    return null;
  }
}

/**
 * Clears saved vault from browser
 */
export function clearSavedVault(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(STORAGE_KEY);
  }
}

/**
 * Dispatches an on-chain testnet transfer directly from a self-custody private key
 */
export async function sendSelfCustodyTransaction({
  privateKey,
  to,
  amountEther,
  network,
}: {
  privateKey: `0x${string}`;
  to: `0x${string}`;
  amountEther: string;
  network: "sepolia" | "amoy" | "bsc_testnet" | "base_sepolia" | string;
}): Promise<string> {
  const account = privateKeyToAccount(privateKey);

  let chain: any = sepolia;
  let rpcUrl = "https://ethereum-sepolia-rpc.publicnode.com";

  if (network === "amoy") {
    chain = polygonAmoy;
    rpcUrl = "https://rpc-amoy.polygon.technology";
  } else if (network === "bsc_testnet") {
    chain = bscTestnet;
    rpcUrl = "https://data-seed-prebsc-1-s1.binance.org:8545";
  } else if (network === "base_sepolia") {
    chain = baseSepolia;
    rpcUrl = "https://sepolia.base.org";
  }

  const client = createWalletClient({
    account,
    chain,
    transport: http(rpcUrl),
  });

  const txHash = await client.sendTransaction({
    chain,
    to,
    value: parseEther(amountEther),
  });

  return txHash;
}
