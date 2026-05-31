// services/workoutService.js
// Mirrors the pattern of dietService.js — stores one AI-generated workout per user per day.
// Table required: daily_workout (id, user_id, date, workout TEXT, created_at)
// Recommended SQL:
//   create table daily_workout (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid references auth.users not null,
//     date date not null,
//     workout text,
//     created_at timestamptz default now(),
//     unique(user_id, date)
//   );

import {supabase} from "../config/supabase.js";
import { generateWorkout } from "./grokService.js";

function todayDate() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/**
 * Load today's workout from DB. If none exists yet, generate via AI, persist it, and return it.
 */
export async function getOrCreateDailyWorkout(userId, userParams = {}) {
  const today = todayDate();

  // 1. Try to load an existing row for today
  const { data: existing, error: fetchError } = await supabase
    .from("daily_workout")
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (fetchError) {
    console.error("daily_workout fetch error:", fetchError.message);
    throw fetchError;
  }

  // 2. If a row already has a workout, return it
  if (existing?.workout) {
    return existing;
  }

  // 3. Generate a new AI workout
  const workoutText = await generateWorkout(userParams);

  // 4. Upsert (handles race conditions gracefully)
  const { data: upserted, error: upsertError } = await supabase
    .from("daily_workout")
    .upsert(
      { user_id: userId, date: today, workout: workoutText },
      { onConflict: "user_id,date", ignoreDuplicates: false }
    )
    .select()
    .single();

  if (upsertError) {
    console.error("daily_workout upsert error:", upsertError.message);
    throw upsertError;
  }

  return upserted;
}
