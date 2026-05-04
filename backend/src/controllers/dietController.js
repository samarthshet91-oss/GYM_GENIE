import { generateDiet } from "../services/geminiService.js";

export async function dietGenerate(req, res, next) {
  try {
    const text = await generateDiet(req.body);
    res.json({ diet: text });
  } catch (error) {
    next(error);
  }
}

