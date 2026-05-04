import { supabase, isSupabaseReady } from "../config/supabase.js";
import { memory, uid } from "../utils/store.js";

const fallback = (userId) => ({ id: uid(), user_id: userId, weight_history: [], workouts_completed: 0, streak: 0, calories: 0 });

export async function getProgress(userId) {
  if (isSupabaseReady) {
    const { data, error } = await supabase.from("progress").select("*").eq("user_id", userId).maybeSingle();
    if (error) throw error;
    return data || fallback(userId);
  }
  let row = memory.progress.find((p) => p.user_id === userId);
  if (!row) {
    row = fallback(userId);
    memory.progress.push(row);
  }
  return row;
}

export async function updateProgress(userId, payload) {
  const current = await getProgress(userId);
  const weight = payload.weight ? Number(payload.weight) : null;
  const next = {
    ...current,
    weight_history: weight ? [...(current.weight_history || []), weight].slice(-12) : current.weight_history || [],
    workouts_completed: Number(payload.workoutCompleted ? (current.workouts_completed || 0) + 1 : payload.workouts_completed ?? current.workouts_completed ?? 0),
    streak: Number(payload.workoutCompleted ? (current.streak || 0) + 1 : payload.streak ?? current.streak ?? 0),
    calories: Number(payload.calories ?? current.calories ?? 0)
  };

  if (isSupabaseReady) {
    const { data, error } = await supabase.from("progress").upsert(next, { onConflict: "user_id" }).select("*").single();
    if (error) throw error;
    return data;
  }

  const index = memory.progress.findIndex((p) => p.user_id === userId);
  if (index >= 0) memory.progress[index] = next;
  else memory.progress.push(next);
  return next;
}

