import { Router } from "express";
import { workoutGenerate, workoutToday } from "../controllers/workoutController.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
router.get("/today", requireAuth, workoutToday);
router.post("/generate", requireAuth, workoutGenerate);
export default router;

