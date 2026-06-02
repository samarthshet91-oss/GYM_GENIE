// services/dietService.js
// FIX: Table name was "dailydiet" — corrected to "daily_diet" (Supabase snake_case convention).
// Table required: daily_diet (id, user_id, date, diet TEXT, breakfast_done BOOL, lunch_done BOOL, snack_done BOOL, dinner_done BOOL, created_at)
// Recommended SQL (run once in Supabase SQL editor):
//   create table if not exists daily_diet (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid references auth.users not null,
//     date date not null,
//     diet text,
//     breakfast_done boolean default false,
//     lunch_done boolean default false,
//     snack_done boolean default false,
//     dinner_done boolean default false,
//     created_at timestamptz default now(),
//     unique(user_id, date)
//   );

import { supabase }from "../config/supabase.js";
import { generateDiet } from "./grokService.js";

function todayDate() {
  return new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
}

/**
 * Load today's diet row from DB.
 * If none exists, generate AI diet, persist it, and return the new row.
 */
export async function getOrCreateDailyDiet(userId, userParams = {}) {
  const today = todayDate();

  // 1. Look for an existing row for today
  const { data: existing, error: fetchError } = await supabase
    .from("daily_diet")          // ← FIXED: was "dailydiet"
    .select("*")
    .eq("user_id", userId)
    .eq("date", today)
    .maybeSingle();

  if (fetchError) {
    console.error("daily_diet fetch error:", fetchError.message);
    throw fetchError;
  }

  // 2. Row exists with a stored diet → return it (no regeneration)
  if (existing?.diet) {
    return existing;
  }

  // 3. Generate AI diet for this user
  const dietText = await generateDiet(userParams);

  // 4. Upsert to avoid duplicate-key errors on concurrent requests
  const { data: upserted, error: upsertError } = await supabase
    .from("daily_diet")          // ← FIXED: was "dailydiet"
    .upsert(
      {
        user_id: userId,
        date: today,
        diet: dietText,
        breakfast_done: false,
        lunch_done: false,
        snack_done: false,
        dinner_done: false,
      },
      { onConflict: "user_id,date", ignoreDuplicates: false }
    )
    .select()
    .single();

  if (upsertError) {
    console.error("daily_diet upsert error:", upsertError.message);
    throw upsertError;
  }

  return upserted;
}

/**
 * Patch meal completion fields on today's row.
 * Only whitelisted boolean columns are allowed.
 */
export async function updateDailyDiet(userId, updates = {}) {
  const today = todayDate();
  const allowed = ["breakfast_done", "lunch_done", "snack_done", "dinner_done"];
  const patch = {};

  for (const key of allowed) {
    if (key in updates) {
      patch[key] = Boolean(updates[key]);
    }
  }

  if (Object.keys(patch).length === 0) {
    throw new Error("No valid fields to update");
  }

  const { data, error } = await supabase
    .from("daily_diet")          // ← FIXED: was "dailydiet"
    .update(patch)
    .eq("user_id", userId)
    .eq("date", today)
    .select()
    .single();

  if (error) {
    console.error("daily_diet update error:", error.message);
    throw error;
  }

  return data;
}