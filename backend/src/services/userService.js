import { supabase, isSupabaseReady } from "../config/supabase.js"; 
import { hashPassword } from "../utils/auth.js";
import { memory, publicUser, uid } from "../utils/store.js";

export async function createUser(payload) {
  console.log("REGISTER PAYLOAD:", payload);
console.log("IS SUPABASE READY:", isSupabaseReady);
  const baseUser = {
    name: payload.name,
    email: payload.email?.toLowerCase(),
    password: hashPassword(payload.password),
    age: payload.age,
    height: payload.height,
    weight: payload.weight,
    goal: payload.goal,
    workout_place: payload.workout_place,
    diet_type: payload.diet_type,
    fitness_level: payload.fitness_level
  };

  if (isSupabaseReady) {
    const { data: existing } = await supabase
      .from("users")
      .select("id")
      .eq("email", baseUser.email)
      .maybeSingle();

    if (existing) {
      throw Object.assign(new Error("Email already registered"), { status: 409 });
    }

    const { data, error } = await supabase
      .from("users")
      .insert(baseUser)
      .select("*")
      .single();

    if (error) {
      console.error("Supabase create user error:", error);
      throw error;
    }

    await ensureProgress(data.id, Number(data.weight) || 0);
    return publicUser(data);
  }

  const user = {
    id: uid(),
    ...baseUser
  };

  if (memory.users.some((u) => u.email === user.email)) {
    throw Object.assign(new Error("Email already registered"), { status: 409 });
  }

  memory.users.push(user);
  await ensureProgress(user.id, Number(user.weight) || 0);
  return publicUser(user);
}
export async function verifyUser(email, password) {
  const normalized = email?.toLowerCase();
  const hashed = hashPassword(password);

  if (isSupabaseReady) {
    const { data, error } = await supabase.from("users").select("*").eq("email", normalized).eq("password", hashed).maybeSingle();
    if (error) throw error;
    return publicUser(data);
  }

  return publicUser(memory.users.find((u) => u.email === normalized && u.password === hashed));
}

export async function getUserById(id) {
  if (isSupabaseReady) {
    const { data, error } = await supabase.from("users").select("*").eq("id", id).maybeSingle();
    if (error) throw error;
    return publicUser(data);
  }
  return publicUser(memory.users.find((u) => u.id === id));
}

export async function updateUser(id, payload) {
  const allowed = ["name", "age", "height", "weight", "goal", "workout_place", "diet_type", "fitness_level"];
  const update = Object.fromEntries(Object.entries(payload).filter(([key]) => allowed.includes(key)));

  if (isSupabaseReady) {
    const { data, error } = await supabase.from("users").update(update).eq("id", id).select("*").single();
    if (error) throw error;
    return publicUser(data);
  }

  const index = memory.users.findIndex((u) => u.id === id);
  if (index === -1) return null;
  memory.users[index] = { ...memory.users[index], ...update };
  return publicUser(memory.users[index]);
}

export async function ensureProgress(userId, startingWeight = 0) {
  if (isSupabaseReady) {
    const { data } = await supabase.from("progress").select("id").eq("user_id", userId).maybeSingle();
    if (!data) {
      await supabase.from("progress").insert({
        user_id: userId,
        weight_history: startingWeight ? [startingWeight] : [],
        workouts_completed: 0,
        streak: 0,
        calories: 0
      });
    }
    return;
  }

  if (!memory.progress.some((p) => p.user_id === userId)) {
    memory.progress.push({ id: uid(), user_id: userId, weight_history: startingWeight ? [startingWeight] : [], workouts_completed: 0, streak: 0, calories: 0 });
  }
}
