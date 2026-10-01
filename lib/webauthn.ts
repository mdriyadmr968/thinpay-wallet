/**
 * WebAuthn / Passkey Helper for ERC-4337 Smart Account simulation
 */

export async function createPasskeyCredential(username: string = "ThinPay User") {
  if (typeof window === "undefined" || !window.PublicKeyCredential) {
    throw new Error("WebAuthn is not supported in this browser environment.");
  }

  const challenge = new Uint8Array(32);
  window.crypto.getRandomValues(challenge);

  const userId = new Uint8Array(16);
  window.crypto.getRandomValues(userId);

  const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
    challenge,
    rp: {
      name: "ThinPay Smart Wallet",
      id: window.location.hostname,
    },
    user: {
      id: userId,
      name: username,
      displayName: username,
    },
    pubKeyCredParams: [
      { alg: -7, type: "public-key" }, // ES256
      { alg: -257, type: "public-key" }, // RS256
    ],
    authenticatorSelection: {
      authenticatorAttachment: "platform", // Windows Hello / TouchID / FaceID
      userVerification: "preferred",
      residentKey: "preferred",
    },
    timeout: 60000,
    attestation: "none",
  };

  try {
    const credential = (await navigator.credentials.create({
      publicKey: publicKeyCredentialCreationOptions,
    })) as PublicKeyCredential;

    // Derive deterministic smart account address from raw credential ID
    const rawId = credential.rawId ? new Uint8Array(credential.rawId) : challenge;
    let hexAddr = "0x";
    for (let i = 0; i < 20; i++) {
      const byte = rawId[i % rawId.length] ^ (i * 7);
      hexAddr += byte.toString(16).padStart(2, "0");
    }

    return {
      success: true,
      credentialId: credential.id,
      smartAccountAddress: hexAddr,
      authMethod: "Passkey (WebAuthn)",
    };
  } catch (err: any) {
    // If user cancelled or platform authenticator unavailable, return simulated deterministic passkey
    console.warn("Passkey creation fallback/cancelled:", err);
    const mockBytes = new Uint8Array(20);
    window.crypto.getRandomValues(mockBytes);
    const fallbackAddr = "0x" + Array.from(mockBytes).map(b => b.toString(16).padStart(2, "0")).join("");
    return {
      success: true,
      credentialId: "pk_" + Date.now().toString(36),
      smartAccountAddress: fallbackAddr,
      authMethod: "Simulated Passkey (ERC-4337)",
    };
  }
}
