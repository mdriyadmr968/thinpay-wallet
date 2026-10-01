import { Router } from "express";
import { handleAuditContract, handleCopilotChat, handleSimulateTransaction } from "../controllers/aiController";

const router = Router();

// POST /api/v1/ai/audit
router.post("/audit", handleAuditContract);

// POST /api/v1/ai/copilot
router.post("/copilot", handleCopilotChat);

// POST /api/v1/ai/simulate
router.post("/simulate", handleSimulateTransaction);

export default router;
