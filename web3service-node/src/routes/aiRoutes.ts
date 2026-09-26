import { Router } from "express";
import { handleAuditContract, handleCopilotChat } from "../controllers/aiController";

const router = Router();

// POST /api/v1/ai/audit
router.post("/audit", handleAuditContract);

// POST /api/v1/ai/copilot
router.post("/copilot", handleCopilotChat);

export default router;
