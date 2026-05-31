import express from "express";
import { getProfile, saveProfile } from "../controllers/userController.js";
import { requireAuth } from "../utils/auth.js";

const router = express.Router();
router.get("/profile",requireAuth, getProfile);
router.patch("/profile", requireAuth, saveProfile);
export default router;

