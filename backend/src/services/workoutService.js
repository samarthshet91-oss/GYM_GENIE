import { isSupabaseReady, supabase } from "../config/supabase.js";
import { generateWorkout } from "./grokService.js";
import { memory } from "../utils/store.js";

const TABLE = "daily_workout";
const DATE_COLUMNS = ["workout_date", "date"];
const WORKOUT_COLUMNS = ["workout", "workout_plan", "generated_workout", "plan"];

function todayDate() {
  return new Date().toISOString().slice(0, 10);
}

function hasColumnError(error) {
  return error?.code === "42703" || String(error?.message || "").toLowerCase().includes("column");
}

function getWorkoutText(row) {
  const column = WORKOUT_COLUMNS.find((key) => Object.prototype.hasOwnProperty.call(row || {}, key));
  return column ? row[column] : "";
}

function setWorkoutText(row, value) {
  const column = WORKOUT_COLUMNS.find((key) => Object.prototype.hasOwnProperty.call(row || {}, key)) || "workout";
  return { ...row, [column]: value };
}

function normalizeWorkout(row) {
  return {
    ...row,
    workout: getWorkoutText(row)
  };
}

function createBaseRow(userId, dateColumn, dateValue) {
  return {
    user_id: userId,
    [dateColumn]: dateValue
  };
}

async function findTodayRow(userId, dateValue) {
  for (const dateColumn of DATE_COLUMNS) {
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .eq("user_id", userId)
      .eq(dateColumn, dateValue)
      .maybeSingle();

    if (!error) return { row: data, dateColumn };
    if (!hasColumnError(error)) throw error;
  }

  throw new Error(`${TABLE} must have either workout_date or date column`);
}

async function insertTodayRow(row) {
  const { data, error } = await supabase
    .from(TABLE)
    .insert(row)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

export async function getOrCreateDailyWorkout(userId, userParams = {}) {
  const dateValue = todayDate();

  if (!isSupabaseReady) {
    let row = memory.dailyWorkout?.find((item) => item.user_id === userId && item.workout_date === dateValue);
    if (!row) {
      const generatedWorkout = await generateWorkout(userParams);
      row = setWorkoutText(createBaseRow(userId, "workout_date", dateValue), generatedWorkout);
      memory.dailyWorkout = [...(memory.dailyWorkout || []), row];
    }
    return normalizeWorkout(row);
  }

  const { row, dateColumn } = await findTodayRow(userId, dateValue);
  if (row) {
    console.log("Loaded daily workout from Supabase:", { userId, date: dateValue });
    return normalizeWorkout(row);
  }

  const generatedWorkout = await generateWorkout(userParams);
  console.log("Generated daily workout:", { userId, date: dateValue });

  const inserted = await insertTodayRow(setWorkoutText(createBaseRow(userId, dateColumn, dateValue), generatedWorkout));
  return normalizeWorkout(inserted);
}
