import { getUserById, updateUser } from "../services/userService.js";

export async function getProfile(req, res, next) {
  try {
    return res.json({
      message: "Profile working",
      user: null
    });
  } catch (error) {
    console.error("Profile error:", error);
    return res.status(500).json({ message: "Error fetching profile" });
  }
}

export async function saveProfile(req, res, next) {
  try {
    const user = await updateUser(req.user.id, req.body);
    res.json({ user });
  } catch (error) {
    next(error);
  }
}

