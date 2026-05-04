import { Router } from "express";
import { progressGet, progressUpdate } from "../controllers/progressController.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
router.get("/", requireAuth, progressGet);
router.post("/update", requireAuth, progressUpdate);
export default router;

