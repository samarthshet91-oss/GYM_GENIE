import { Router } from "express";
import { dietGenerate } from "../controllers/dietController.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
router.post("/generate", requireAuth, dietGenerate);
export default router;

