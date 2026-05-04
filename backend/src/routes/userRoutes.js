import { Router } from "express";
import { getProfile, saveProfile } from "../controllers/userController.js";
import { requireAuth } from "../utils/auth.js";

const router = Router();
router.get("/profile", getProfile);
router.post("/profile", requireAuth, saveProfile);
export default router;

