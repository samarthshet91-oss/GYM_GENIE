import { getProgress, updateProgress } from "../services/progressService.js";

export async function progressGet(req, res, next) {
  try {
    const progress = await getProgress(req.user.id);
    res.json({ progress });
  } catch (error) {
    next(error);
  }
}

export async function progressUpdate(req, res, next) {
  try {
    const progress = await updateProgress(req.user.id, req.body);
    res.json({ progress });
  } catch (error) {
    next(error);
  }
}

