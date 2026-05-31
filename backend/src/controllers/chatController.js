import { coachChat } from "../services/grokService.js";
import { getUserById } from "../services/userService.js";

export async function chat(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    const reply = await coachChat({ message: req.body.message, user });
    res.json({ reply });
  } catch (error) {
    next(error);
  }
}

