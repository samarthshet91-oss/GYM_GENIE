import OpenAI from "openai";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY || "missing-openrouter-key",
});

const model = process.env.OPENROUTER_MODEL || "openrouter/free";

function safeText(value, fallback = "not specified") {
  if (value === null || value === undefined || value === "") return fallback;
  if (typeof value === "string" || typeof value === "number") return String(value);
  return fallback;
}

async function openRouterChat({ system, prompt, fallback, maxTokens = 900 }) {
  if (!process.env.OPENROUTER_API_KEY || process.env.OPENROUTER_API_KEY.includes("your_")) {
    return fallback;
  }

  try {
    const completion = await client.chat.completions.create({
      model,
      temperature: 0.86,
      max_tokens: maxTokens,
      messages: [
        { role: "system", content: system },
        { role: "user", content: prompt }
      ],
    });

    return completion.choices[0]?.message?.content || fallback;
  } catch (error) {
    console.error("OpenRouter error:", error.response?.data || error.message || error);
    return fallback;
  }
}

export async function coachChat({ message, user }) {
  const fallback = "Keep today simple: one focused workout, one protein-rich meal, and a short walk. Small wins compound fast.";

  return openRouterChat({
    system: "You are GymGenie AI, a premium fitness coach. Give short, motivating, useful fitness advice with safe, practical guidance.",
    prompt: `User profile: ${JSON.stringify(user || {})}\n\nUser message: ${safeText(message, "Give me fitness advice.")}`,
    fallback,
    maxTokens: 650
  });
}

export async function generateWorkout({ age, weight, gender, goal, level, fitness_level, place, workout_place, time }) {
  const duration = safeText(time, "30");
  const fitnessLevel = safeText(level || fitness_level, "beginner");
  const location = safeText(place || workout_place, "home");
  const userSummary = [
    `Age: ${safeText(age)}`,
    `Weight: ${safeText(weight)} kg`,
    `Gender: ${safeText(gender)}`,
    `Goal: ${safeText(goal, "general fitness")}`,
    `Fitness level: ${fitnessLevel}`,
    `Workout location: ${location}`,
    `Duration: ${duration} minutes`
  ].join("\n");

  const fallback = [
    `Warmup: 5 minutes of joint circles, marching in place, hip openers, and easy squats.`,
    `Main exercises: 3 rounds for a ${fitnessLevel} ${safeText(goal, "general fitness")} session at ${location}.`,
    `1. Squats - 3 sets x 12 reps.`,
    `2. Push-ups or incline push-ups - 3 sets x 10 reps.`,
    `3. Rows or towel rows - 3 sets x 12 reps.`,
    `4. Lunges - 3 sets x 10 reps each side.`,
    `5. Plank - 3 holds x 30 seconds.`,
    `Cooldown: 5 minutes of hamstring, chest, quad, and child-pose breathing.`,
    `Safety tips: Keep form clean, stop sharp pain immediately, hydrate, and scale reps when breathing gets too strained.`
  ].join("\n");

  return openRouterChat({
    system: "You are GymGenie AI, an expert fitness programmer. Create safe, personalized workouts. Return clean plain text only. Do not use markdown tables or code fences.",
    prompt: `Generate a personalized workout. Make it specific to this user so different profiles receive different plans. Return 5-6 exercise lines in this exact style: Exercise name - sets, reps, time, or form cue. You may include short Warmup and Cooldown lines, but no markdown tables.\n\n${userSummary}`,
    fallback,
    maxTokens: 950
  });
}

export async function generateDiet({ age, weight, goal, level, fitness_level, place, workout_place, dietType, diet_type }) {
  const fitnessLevel = safeText(level || fitness_level, "beginner");
  const location = safeText(place || workout_place, "home");
  const dietPreference = safeText(dietType || diet_type, "balanced");
  const userSummary = [
    `Age: ${safeText(age)}`,
    `Weight: ${safeText(weight)} kg`,
    `Goal: ${safeText(goal, "healthy lifestyle")}`,
    `Fitness level: ${fitnessLevel}`,
    `Workout location: ${location}`,
    `Diet preference: ${dietPreference}`
  ].join("\n");

  const fallback = [
    `Breakfast: Oats with curd or milk, fruit, and a protein option that matches ${dietPreference} preference.`,
    `Lunch: Rice or roti, dal or lean protein, vegetables, and curd.`,
    `Snacks: Roasted chana, nuts, sprouts, fruit, or a simple protein shake.`,
    `Dinner: Light protein bowl with vegetables and moderate carbs.`,
    `Daily calorie estimate: Around ${safeText(goal).toLowerCase().includes("gain") ? "2400-2800" : "1800-2200"} kcal, adjusted by hunger, weight trend, and training intensity.`,
    `Practical substitutions: Swap rice with roti, paneer with tofu/eggs/chicken, curd with soy curd, and nuts with roasted chana when needed.`
  ].join("\n");

  return openRouterChat({
    system: "You are GymGenie AI, a practical sports nutrition coach. Create safe daily diet plans. Return clear sections only: Breakfast, Lunch, Snacks, Dinner, Daily calorie estimate, Practical substitutions.",
    prompt: `Generate a personalized daily diet plan. Make it specific to this user so different profiles receive different plans.\n\n${userSummary}`,
    fallback,
    maxTokens: 950
  });
}
