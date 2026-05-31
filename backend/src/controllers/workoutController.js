import { generateWorkout } from "../services/grokService.js";
import { getUserById } from "../services/userService.js";
import { getOrCreateDailyWorkout } from "../services/workoutService.js";

export async function workoutToday(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    const workout = await getOrCreateDailyWorkout(req.user.id, { ...user, ...req.body });
    res.json({ workout });
  } catch (error) {
    console.error("Daily workout load failed:", error);
    next(error);
  }
}

export async function workoutGenerate(req, res, next) {
  try {
    const user = await getUserById(req.user.id);
    const text = await generateWorkout({ ...user, ...req.body });
    console.log("Workout AI generated:", {
      userId: req.user.id,
      goal: req.body.goal || user?.goal,
      fitnessLevel: req.body.fitness_level || req.body.level || user?.fitness_level,
      workoutPlace: req.body.workout_place || req.body.place || user?.workout_place
    });
    res.json({ workout: text });
  } catch (error) {
    console.error("Workout generation failed:", error);
    next(error);
  }
}
