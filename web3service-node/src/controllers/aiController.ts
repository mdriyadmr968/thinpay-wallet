import { Request, Response } from "express";
import { auditSmartContract, chatCopilot, simulateTransaction } from "../services/geminiService";

export async function handleAuditContract(req: Request, res: Response) {
  try {
    const { address, chain = "sepolia", sourceCode } = req.body;
    if (!address) {
      return res.status(400).json({ error: "contract address is required" });
    }

    const audit = await auditSmartContract(address, chain, sourceCode);
    return res.json({ success: true, audit });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Audit failed" });
  }
}

export async function handleCopilotChat(req: Request, res: Response) {
  try {
    const { message, context } = req.body;
    if (!message) {
      return res.status(400).json({ error: "message is required" });
    }

    const reply = await chatCopilot(message, context);
    return res.json({ success: true, reply });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Copilot failed" });
  }
}

export async function handleSimulateTransaction(req: Request, res: Response) {
  try {
    const { to, value, data, chain, sender } = req.body;
    if (!to) {
      return res.status(400).json({ error: "Target address 'to' is required" });
    }

    const simulation = await simulateTransaction({ to, value, data, chain, sender });
    return res.json({ success: true, simulation });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || "Simulation failed" });
  }
}
