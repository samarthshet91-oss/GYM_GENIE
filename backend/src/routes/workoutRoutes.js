import { Router } from "express";
import { workoutGenerate } from "../controllers/workoutController.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
router.post("/generate", requireAuth, workoutGenerate);
export default router;

