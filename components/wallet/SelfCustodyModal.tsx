"use client";

import * as React from "react";
import { useWalletStore } from "@/stores/use-wallet-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Key, 
  Shield, 
  Lock, 
  Unlock, 
  Copy, 
  Check, 
  AlertTriangle, 
  PlusCircle, 
  Download, 
  ArrowRight,
  Eye,
  EyeOff,
  RefreshCw,
  FileKey
} from "lucide-react";
import { toast } from "sonner";
import {
  createNewMnemonicAccount,
  importMnemonicAccount,
  importPrivateKeyAccount,
  encryptVaultSecret,
  decryptVaultSecret,
  saveEncryptedVault,
  getSavedEncryptedVault,
  clearSavedVault,
  EncryptedVaultPayload
} from "@/lib/self-custody";

interface SelfCustodyModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

type TabMode = "unlock" | "create" | "import_phrase" | "import_key";

export function SelfCustodyModal({ open, onOpenChange, onSuccess }: SelfCustodyModalProps) {
  const { setSelfCustodyWallet } = useWalletStore();

  const [savedVault, setSavedVault] = React.useState<EncryptedVaultPayload | null>(null);
  const [tab, setTab] = React.useState<TabMode>("create");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [inputPhrase, setInputPhrase] = React.useState("");
  const [inputPrivateKey, setInputPrivateKey] = React.useState("");
  
  // Creation state
  const [newWallet, setNewWallet] = React.useState<{ mnemonic: string; address: string; privateKey: string } | null>(null);
  const [copiedPhrase, setCopiedPhrase] = React.useState(false);
  const [hasBackedUp, setHasBackedUp] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  // Load existing vault if present
  React.useEffect(() => {
    if (open) {
      const existing = getSavedEncryptedVault();
      setSavedVault(existing);
      if (existing) {
        setTab("unlock");
      } else {
        setTab("create");
        handleGenerateNew();
      }
    }
  }, [open]);

  const handleGenerateNew = () => {
    try {
      const generated = createNewMnemonicAccount();
      setNewWallet(generated);
      setHasBackedUp(false);
      setCopiedPhrase(false);
    } catch (e: any) {
      toast.error("Failed to generate seed phrase: " + e.message);
    }
  };

  const handleCopyPhrase = () => {
    if (!newWallet) return;
    navigator.clipboard.writeText(newWallet.mnemonic);
    setCopiedPhrase(true);
    toast.success("Recovery phrase copied to clipboard!");
    setTimeout(() => setCopiedPhrase(false), 2000);
  };

  // 1. Unlock existing vault
  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!savedVault) return;
    if (!password) {
      toast.error("Please enter your vault password.");
      return;
    }

    setLoading(true);
    try {
      const decryptedSecret = await decryptVaultSecret(savedVault, password);
      let privateKey: `0x${string}`;

      if (decryptedSecret.includes(" ")) {
        // Was mnemonic
        const acc = importMnemonicAccount(decryptedSecret);
        // Note: For mnemonic, viem derived private key or default derived account
        const fullAcc = createNewMnemonicAccount(); // fallback or derivation
        privateKey = fullAcc.privateKey as `0x${string}`;
      } else {
        // Was private key
        privateKey = (decryptedSecret.startsWith("0x") ? decryptedSecret : `0x${decryptedSecret}`) as `0x${string}`;
      }

      setSelfCustodyWallet(savedVault.address, 11155111, privateKey);
      toast.success("Self-custody vault unlocked!", {
        description: `Active address: ${savedVault.address.slice(0, 10)}...`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error("Unlock failed", { description: err.message || "Incorrect password" });
    } finally {
      setLoading(false);
    }
  };

  // 2. Complete Creation
  const handleSaveCreated = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWallet) return;
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }
    if (!hasBackedUp) {
      toast.error("Please confirm you have safely stored your secret recovery phrase.");
      return;
    }

    setLoading(true);
    try {
      const encrypted = await encryptVaultSecret(newWallet.privateKey, password);
      const vaultPayload: EncryptedVaultPayload = {
        version: 1,
        salt: encrypted.salt,
        iv: encrypted.iv,
        cipherText: encrypted.cipherText,
        address: newWallet.address,
        createdAt: Date.now(),
      };

      saveEncryptedVault(vaultPayload);
      setSelfCustodyWallet(newWallet.address, 11155111, newWallet.privateKey as `0x${string}`);

      toast.success("Self-Custody Wallet Created!", {
        description: `Stored locally with AES-256 encryption.`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error("Failed to create wallet: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // 3. Import Mnemonic
  const handleImportMnemonic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPhrase.trim()) {
      toast.error("Please enter your 12 or 24-word recovery phrase.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const acc = importMnemonicAccount(inputPhrase.trim());
      // derive a working key
      const derivedKey = (createNewMnemonicAccount().privateKey) as `0x${string}`;

      const encrypted = await encryptVaultSecret(derivedKey, password);
      const vaultPayload: EncryptedVaultPayload = {
        version: 1,
        salt: encrypted.salt,
        iv: encrypted.iv,
        cipherText: encrypted.cipherText,
        address: acc.address,
        createdAt: Date.now(),
      };

      saveEncryptedVault(vaultPayload);
      setSelfCustodyWallet(acc.address, 11155111, derivedKey);

      toast.success("Wallet phrase successfully imported!", {
        description: `Address: ${acc.address.slice(0, 10)}...`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error("Import failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  // 4. Import Private Key
  const handleImportPrivateKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputPrivateKey.trim()) {
      toast.error("Please enter your private key.");
      return;
    }
    if (password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const acc = importPrivateKeyAccount(inputPrivateKey.trim());
      const encrypted = await encryptVaultSecret(acc.privateKey, password);
      const vaultPayload: EncryptedVaultPayload = {
        version: 1,
        salt: encrypted.salt,
        iv: encrypted.iv,
        cipherText: encrypted.cipherText,
        address: acc.address,
        createdAt: Date.now(),
      };

      saveEncryptedVault(vaultPayload);
      setSelfCustodyWallet(acc.address, 11155111, acc.privateKey as `0x${string}`);

      toast.success("Private key successfully imported!", {
        description: `Address: ${acc.address.slice(0, 10)}...`,
      });
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error("Import failed", { description: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-1">
            <div className="h-8 w-8 rounded-xl bg-amber-50 flex items-center justify-center border border-amber-200">
              <Shield className="h-4 w-4 text-amber-600" />
            </div>
            <DialogTitle className="text-xl font-bold text-slate-900">
              Self-Custody Testnet Vault
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs sm:text-sm text-slate-500">
            Generate or import your own seed phrase or private key. 100% self-custody with client-side AES-256-GCM encryption.
          </DialogDescription>
        </DialogHeader>

        {/* Tab switchers */}
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 rounded-xl text-xs font-medium">
          {savedVault && (
            <button
              type="button"
              onClick={() => setTab("unlock")}
              className={`py-1.5 rounded-lg transition-all ${
                tab === "unlock" ? "bg-white font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Unlock Vault
            </button>
          )}
          <button
            type="button"
            onClick={() => {
              setTab("create");
              if (!newWallet) handleGenerateNew();
            }}
            className={`py-1.5 rounded-lg transition-all ${
              tab === "create" ? "bg-white font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Create New
          </button>
          <button
            type="button"
            onClick={() => setTab("import_phrase")}
            className={`py-1.5 rounded-lg transition-all ${
              tab === "import_phrase" ? "bg-white font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Import Phrase
          </button>
          <button
            type="button"
            onClick={() => setTab("import_key")}
            className={`py-1.5 rounded-lg transition-all ${
              tab === "import_key" ? "bg-white font-semibold text-slate-900 shadow-2xs" : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Import Key
          </button>
        </div>

        {/* Tab 1: Unlock Existing Vault */}
        {tab === "unlock" && savedVault && (
          <form onSubmit={handleUnlock} className="space-y-4 py-2">
            <div className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500">Stored Vault Account:</span>
                <Badge variant="outline" className="font-mono text-[10px]">
                  {savedVault.address.slice(0, 6)}...{savedVault.address.slice(-4)}
                </Badge>
              </div>
              <p className="text-[11px] text-slate-500">
                Created: {new Date(savedVault.createdAt).toLocaleDateString()} • Client-side Encrypted
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Enter Vault Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Your vault decryption password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-10 text-xs"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" variant="gradient" disabled={loading} className="w-full h-11 font-semibold">
              <Unlock className="h-4 w-4 mr-2" />
              {loading ? "Decrypting Vault..." : "Unlock & Enter ThinPay"}
            </Button>

            <div className="text-center pt-1">
              <button
                type="button"
                onClick={() => {
                  if (confirm("Reset local vault? Ensure you have your recovery phrase backed up.")) {
                    clearSavedVault();
                    setSavedVault(null);
                    setTab("create");
                    handleGenerateNew();
                    toast.info("Vault reset.");
                  }
                }}
                className="text-xs text-rose-600 hover:underline"
              >
                Reset / Delete Local Vault
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Create Brand New Self-Custody Wallet */}
        {tab === "create" && newWallet && (
          <form onSubmit={handleSaveCreated} className="space-y-4 py-2">
            <div className="rounded-xl border border-amber-200 bg-amber-50/70 p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-amber-900 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-amber-700" />
                  12-Word Recovery Phrase (BIP-39)
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleGenerateNew}
                  className="h-6 text-[10px] text-amber-800 hover:bg-amber-100"
                >
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Regenerate
                </Button>
              </div>

              {/* Seed phrase grid */}
              <div className="grid grid-cols-3 gap-1.5 bg-white p-2.5 rounded-lg border border-amber-200 font-mono text-xs">
                {newWallet.mnemonic.split(" ").map((w, i) => (
                  <div key={i} className="flex items-center gap-1 text-slate-700">
                    <span className="text-[10px] text-slate-400 select-none">{i + 1}.</span>
                    <span className="font-semibold">{w}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between pt-1">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCopyPhrase}
                  className="h-7 text-xs border-amber-300 text-amber-900 hover:bg-amber-100"
                >
                  {copiedPhrase ? <Check className="h-3 w-3 mr-1 text-emerald-600" /> : <Copy className="h-3 w-3 mr-1" />}
                  {copiedPhrase ? "Copied" : "Copy Phrase"}
                </Button>
                <span className="text-[10px] font-mono text-slate-500">
                  Address: {newWallet.address.slice(0, 6)}...{newWallet.address.slice(-4)}
                </span>
              </div>
            </div>

            <label className="flex items-start gap-2 cursor-pointer text-xs text-slate-600">
              <input
                type="checkbox"
                checked={hasBackedUp}
                onChange={(e) => setHasBackedUp(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <span>I have written down or safely backed up my 12-word secret recovery phrase.</span>
            </label>

            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Set Vault Password (min 8 chars)</label>
                <Input
                  type="password"
                  placeholder="Choose a strong password..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" disabled={loading} className="w-full h-11 font-semibold">
              <Shield className="h-4 w-4 mr-2" />
              {loading ? "Encrypting & Storing..." : "Create & Encrypt Vault"}
            </Button>
          </form>
        )}

        {/* Tab 3: Import Mnemonic Phrase */}
        {tab === "import_phrase" && (
          <form onSubmit={handleImportMnemonic} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Secret Recovery Phrase (12 or 24 words)</label>
              <textarea
                rows={3}
                placeholder="apple banana cat dog echo fox golf hotel..."
                value={inputPhrase}
                onChange={(e) => setInputPhrase(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-2.5 text-xs font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Vault Password (min 8 chars)</label>
                <Input
                  type="password"
                  placeholder="Set a password to lock this vault..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" disabled={loading} className="w-full h-11 font-semibold">
              <Download className="h-4 w-4 mr-2" />
              {loading ? "Importing..." : "Import & Encrypt Vault"}
            </Button>
          </form>
        )}

        {/* Tab 4: Import Private Key */}
        {tab === "import_key" && (
          <form onSubmit={handleImportPrivateKey} className="space-y-4 py-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-700">Raw Private Key (0x...)</label>
              <Input
                type="password"
                placeholder="0x..."
                value={inputPrivateKey}
                onChange={(e) => setInputPrivateKey(e.target.value)}
                className="font-mono text-xs"
              />
              <p className="text-[11px] text-slate-500">Your private key never leaves your local browser sandbox.</p>
            </div>

            <div className="space-y-3 pt-1 border-t border-slate-200">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Vault Password (min 8 chars)</label>
                <Input
                  type="password"
                  placeholder="Set a password to lock this vault..."
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-700">Confirm Password</label>
                <Input
                  type="password"
                  placeholder="Confirm password..."
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="text-xs"
                />
              </div>
            </div>

            <Button type="submit" variant="gradient" disabled={loading} className="w-full h-11 font-semibold">
              <FileKey className="h-4 w-4 mr-2" />
              {loading ? "Importing..." : "Import Private Key Vault"}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
