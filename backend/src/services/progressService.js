import { supabase, isSupabaseReady } from "../config/supabase.js";
import { memory, uid } from "../utils/store.js";

const fallback = (userId) => ({ id: uid(), user_id: userId, weight_history: [], workouts_completed: 0, streak: 0, calories: 0 });
const WORKOUT_HISTORY_TYPE = "workout_completion";
const DEFAULT_EXERCISE_CALORIES = 50;

function dateKey(value = new Date()) {
  return value.toISOString().slice(0, 10);
}

function normalizeHistory(history) {
  return Array.isArray(history) ? history : [];
}

function isWorkoutHistoryEntry(entry) {
  return entry && typeof entry === "object" && entry.type === WORKOUT_HISTORY_TYPE;
}

function isWeightHistoryEntry(entry) {
  return typeof entry === "number" || (typeof entry === "string" && entry.trim() !== "" && Number.isFinite(Number(entry)));
}

function getCompletedExercisesForDate(history, key = dateKey()) {
  const entry = normalizeHistory(history).find((item) => isWorkoutHistoryEntry(item) && item.date === key);
  return Array.isArray(entry?.exercises) ? entry.exercises.filter(Boolean) : [];
}

function upsertWorkoutHistory(history, exercises, key = dateKey(), caloriesBurned = 0) {
  const normalizedHistory = normalizeHistory(history);
  const existingEntry = normalizedHistory.find((item) => isWorkoutHistoryEntry(item) && item.date === key);
  const existingExercises = Array.isArray(existingEntry?.exercises) ? existingEntry.exercises : [];
  const mergedExercises = Array.from(new Set([...existingExercises, ...exercises].filter(Boolean)));
  const completionEntry = {
    type: WORKOUT_HISTORY_TYPE,
    date: key,
    exercises: mergedExercises,
    calories: Number(existingEntry?.calories || 0) + caloriesBurned,
    updated_at: new Date().toISOString()
  };

  const withoutToday = normalizedHistory.filter((item) => !(isWorkoutHistoryEntry(item) && item.date === key));
  return [...withoutToday, completionEntry];
}

function appendWeight(history, weight) {
  const normalizedHistory = normalizeHistory(history);
  if (!weight) return normalizedHistory;

  const weights = normalizedHistory.filter(isWeightHistoryEntry).map(Number);
  const metadata = normalizedHistory.filter((entry) => !isWeightHistoryEntry(entry));
  return [...weights, weight].slice(-12).concat(metadata);
}

function enrichProgress(progress) {
  return {
    ...progress,
    completed_exercises_today: getCompletedExercisesForDate(progress?.weight_history)
  };
}

export async function getProgress(userId) {
  if (isSupabaseReady) {
    const { data, error } = await supabase.from("progress").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return enrichProgress(data || fallback(userId));
  }
  let row = memory.progress.find((p) => p.user_id === userId);
  if (!row) {
    row = fallback(userId);
    memory.progress.push(row);
  }
  return enrichProgress(row);
}

export async function updateProgress(userId, payload) {
  const current = await getProgress(userId);
  const weight = payload.weight ? Number(payload.weight) : null;
  const currentHistory = normalizeHistory(current.weight_history);
  const completedExerciseNames = Array.isArray(payload.completedExercises)
    ? payload.completedExercises
    : payload.completedExerciseName
      ? [payload.completedExerciseName]
      : [];
  const today = dateKey();
  const alreadyCompletedToday = getCompletedExercisesForDate(currentHistory, today);
  const newExercises = completedExerciseNames.filter((name) => !alreadyCompletedToday.includes(name));
  const isWorkoutCompletion = payload.workoutCompleted || newExercises.length > 0;
  const caloriesBurned = Number(payload.caloriesBurned ?? newExercises.length * DEFAULT_EXERCISE_CALORIES);
  const effectiveCaloriesBurned = newExercises.length
    ? caloriesBurned
    : payload.workoutCompleted && !completedExerciseNames.length
      ? caloriesBurned
      : 0;
  const updatedHistory = isWorkoutCompletion && completedExerciseNames.length
    ? upsertWorkoutHistory(appendWeight(currentHistory, weight), completedExerciseNames, today, effectiveCaloriesBurned)
    : appendWeight(currentHistory, weight);
  const workoutIncrement = newExercises.length || (payload.workoutCompleted && !completedExerciseNames.length ? 1 : 0);
  const shouldAdvanceStreak = isWorkoutCompletion && alreadyCompletedToday.length === 0;
  const next = {
    ...current,
    weight_history: updatedHistory,
    workouts_completed: Number(isWorkoutCompletion ? (current.workouts_completed || 0) + workoutIncrement : payload.workouts_completed ?? current.workouts_completed ?? 0),
    streak: Number(shouldAdvanceStreak ? (current.streak || 0) + 1 : payload.streak ?? current.streak ?? 0),
    calories: Number(isWorkoutCompletion ? (current.calories || 0) + effectiveCaloriesBurned : payload.calories ?? current.calories ?? 0)
  };
  delete next.completed_exercises_today;

  console.log("Progress update:", {
    userId,
    completedExerciseNames,
    newExercises,
    workoutIncrement,
    caloriesBurned: effectiveCaloriesBurned,
    streak: next.streak
  });

  if (isSupabaseReady) {
    const { data, error } = await supabase.from("progress").upsert(next, { onConflict: "user_id" }).select("*").single();
    if (error) throw error;
    return enrichProgress(data);
  }

  const index = memory.progress.findIndex((p) => p.user_id === userId);
  if (index >= 0) memory.progress[index] = next;
  else memory.progress.push(next);
  return enrichProgress(next);
}

