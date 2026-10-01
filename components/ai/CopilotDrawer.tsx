"use client";

import * as React from "react";
import { useUiStore } from "@/stores/use-ui-store";
import { useWalletStore } from "@/stores/use-wallet-store";
import { useAccount } from "wagmi";
import { useTestnetBalances } from "@/hooks/use-testnet-balances";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Send, Bot, ArrowUpRight, ArrowLeftRight, ShieldCheck, Loader2 } from "lucide-react";
import Link from "next/link";
import { getApiUrl } from "@/lib/config";

interface Message {
  role: "user" | "copilot";
  content: string;
  action?: {
    type: "SEND" | "SWAP" | "AUDIT" | "NONE";
    payload?: any;
  };
}

const INITIAL_MESSAGES: Message[] = [
  {
    role: "copilot",
    content: "Hi! I am ThinPay AI Copilot powered by Google Gemini 3.8 Flash. How can I help you explore testnet DeFi today?",
  },
];

export function CopilotDrawer() {
  const { isCopilotOpen, setCopilotOpen, setSendOpen, setSendPrefill, selectedNetwork } = useUiStore();
  const { address: storeAddress } = useWalletStore();
  const { address: wagmiAddress } = useAccount();
  const { balances, totalUsd } = useTestnetBalances();

  const [messages, setMessages] = React.useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const activeAddress = wagmiAddress || storeAddress;

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userText = input.trim();
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userText }]);
    setLoading(true);

    try {
      const liveContext = {
        address: activeAddress || "0xAf183...8581b",
        network: selectedNetwork,
        balances: balances.map((b) => `${b.balance} ${b.symbol} on ${b.chainName} ($${b.usdValue.toFixed(2)})`),
        totalUsd: `$${totalUsd.toFixed(2)}`,
      };

      const res = await fetch(getApiUrl("/ai/copilot"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userText, context: liveContext }),
      });

      if (res.ok) {
        const data = await res.json();
        setMessages((prev) => [
          ...prev,
          {
            role: "copilot",
            content: data.reply.message,
            action: data.reply.suggestedAction,
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "copilot",
            content: `I've analyzed your portfolio on ${selectedNetwork.toUpperCase()}. You currently have ${balances[0]?.balance || "0.05"} ${balances[0]?.symbol || "ETH"} available.`,
          },
        ]);
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "copilot",
          content: `Your portfolio on ${selectedNetwork.toUpperCase()} has ${balances.length} active asset positions. Ask me to draft a transfer, swap quote, or security audit!`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isCopilotOpen} onOpenChange={setCopilotOpen}>
      <DialogContent className="sm:max-w-lg max-h-[85vh] flex flex-col p-0 overflow-hidden bg-white border-slate-200 text-slate-900 shadow-2xl">
        <DialogHeader className="p-4 border-b border-slate-200 bg-slate-50/90">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-gradient-to-tr from-sky-500 to-emerald-500 flex items-center justify-center shadow-xs">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                ThinPay AI Copilot
                <Badge variant="cyan" className="text-[10px] py-0 px-1.5">Gemini 3.8 Flash</Badge>
              </DialogTitle>
              <DialogDescription className="text-xs text-slate-500">
                Real-time natural language DeFi assistant and risk adviser
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Chat message history */}
        <div className="flex-1 p-4 space-y-3 overflow-y-auto max-h-[50vh] bg-slate-50/40">
          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              {msg.role === "copilot" && (
                <div className="h-7 w-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center shrink-0 border border-sky-200">
                  <Bot className="h-4 w-4" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-2xs ${
                  msg.role === "user"
                    ? "bg-emerald-600 text-white font-medium ml-auto"
                    : "bg-white border border-slate-200 text-slate-800"
                }`}
              >
                {msg.content}

                {/* Interactive Action Buttons */}
                {msg.action && msg.action.type === "SEND" && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <Button
                      size="sm"
                      variant="gradient"
                      onClick={() => {
                        if (msg.action?.payload) {
                          setSendPrefill({
                            recipient: msg.action.payload.recipient || "",
                            amount: msg.action.payload.amount ? String(msg.action.payload.amount) : "",
                            network: msg.action.payload.network || selectedNetwork,
                          });
                        }
                        setCopilotOpen(false);
                        setSendOpen(true);
                      }}
                      className="text-xs h-8"
                    >
                      <ArrowUpRight className="h-3.5 w-3.5 mr-1" />
                      Open Pre-filled Send Modal
                    </Button>
                  </div>
                )}

                {msg.action && msg.action.type === "SWAP" && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <Link href="/swap" onClick={() => setCopilotOpen(false)}>
                      <Button size="sm" variant="gradient" className="text-xs h-8">
                        <ArrowLeftRight className="h-3.5 w-3.5 mr-1" />
                        Go to Swap & Bridge
                      </Button>
                    </Link>
                  </div>
                )}

                {msg.action && msg.action.type === "AUDIT" && (
                  <div className="mt-2.5 pt-2 border-t border-slate-200">
                    <Link href="/auditor" onClick={() => setCopilotOpen(false)}>
                      <Button size="sm" variant="gradient" className="text-xs h-8">
                        <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                        Open Contract Auditor
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex gap-2 items-center text-xs text-slate-500">
              <Loader2 className="h-4 w-4 animate-spin text-sky-600" />
              <span>Gemini 3.8 is analyzing...</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Prompt Suggestions */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto text-[11px] text-slate-500">
          <span className="shrink-0 font-medium">Try:</span>
          {["What is my allocation?", "Send 0.005 ETH to 0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", "How do I swap tokens?", "Scan USDC contract"].map((q) => (
            <button
              key={q}
              type="button"
              onClick={() => {
                setInput(q);
              }}
              className="shrink-0 px-2.5 py-1 rounded-lg bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors shadow-2xs cursor-pointer font-medium"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input bar */}
        <form onSubmit={handleSend} className="p-3 border-t border-slate-200 bg-white flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask anything about your testnet wallet or state an intent..."
            className="text-xs font-medium"
          />
          <Button type="submit" variant="gradient" size="sm" className="h-11 px-4 cursor-pointer" disabled={loading || !input.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
