import { createToken } from "../utils/auth.js";
import { createUser, verifyUser } from "../services/userService.js";

export async function register(req, res, next) {
  try {
    const user = await createUser(req.body);
    res.status(201).json({ user, token: createToken(user) });
  } catch (error) {
    next(error);
  }
}

export async function login(req, res, next) {
  try {
    const user = await verifyUser(req.body.email, req.body.password);
    if (!user) return res.status(401).json({ message: "Invalid email or password" });
    res.json({ user, token: createToken(user) });
  } catch (error) {
    next(error);
  }
}

