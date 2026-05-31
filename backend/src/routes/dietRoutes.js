import { Router } from "express";
import { dietGenerate, dietToday, dietUpdate } from "../controllers/dietController.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
router.get("/today", requireAuth, dietToday);
router.patch("/today", requireAuth, dietUpdate);
router.post("/generate", requireAuth, dietGenerate);
export default router;

