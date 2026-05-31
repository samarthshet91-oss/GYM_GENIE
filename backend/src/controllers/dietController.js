import { generateDiet } from "../services/grokService.js";
import { getOrCreateDailyDiet, updateDailyDiet } from "../services/dietService.js";
import { getUserById } from "../services/userService.js";

export async function dietGenerate(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    const text = await generateDiet({ ...user, ...req.body });
    res.json({ diet: text });
  } catch (error) {
    console.error("Diet generation failed:", error);
    next(error);
  }
}

export async function dietToday(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    // getOrCreateDailyDiet now stores AI output and reuses it on same day (P2 + P3 fix)
    const diet = await getOrCreateDailyDiet(req.user.id, { ...user, ...req.body });
    res.json({ diet });
  } catch (error) {
    console.error("Daily diet load failed:", error);
    next(error);
  }
}

export async function dietUpdate(req, res, next) {
  try {
    const diet = await updateDailyDiet(req.user.id, req.body);
    res.json({ diet });
  } catch (error) {
    console.error("Daily diet update failed:", error);
    next(error);
  }
}
