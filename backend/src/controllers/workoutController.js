import { generateWorkout } from "../services/geminiService.js";

export async function workoutGenerate(req, res, next) {
  try {
    const text = await generateWorkout(req.body);
    res.json({ workout: text });
  } catch (error) {
    next(error);
  }
}

