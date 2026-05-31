import express from "express";
import { coachChat } from "../services/grokService.js";

const router = express.Router();

router.post("/ask-ai", async (req, res) => {
  try {
    const { prompt } = req.body;

    const reply = await coachChat({ message: prompt });

    res.json({ reply });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "AI request failed",
    });
  }
});

export default router;