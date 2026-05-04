import axios from "axios";

const GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

async function gemini(prompt, fallback) {
  const key = process.env.GEMINI_API_KEY;
  if (!key || key.includes("your_")) return fallback;

  try {
    const { data } = await axios.post(`${GEMINI_URL}?key=${key}`, {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { temperature: 0.85, maxOutputTokens: 900 }
    });
    return data?.candidates?.[0]?.content?.parts?.[0]?.text || fallback;
  } catch (error) {
    console.error("Gemini error:", error.response?.data || error.message);
    return "Gemini is connected but quota/rate limit is blocking the response. Try again after 1 minute.";
  }
}

export async function generateWorkout({ goal, level, time, place }) {
  const prompt = `Generate a structured fitness workout for goal: ${goal}, fitness level: ${level}, duration: ${time} minutes, place: ${place}. Return concise sections: warmup, exercises with sets/reps/time, cooldown, safety tips.`;
  const fallback = `Warmup: 5 minutes mobility.\nWorkout: 3 rounds of squats, push-ups, rows, lunges, plank, and light cardio for ${time || 30} minutes.\nFocus: ${goal || "general fitness"} at ${place || "home"}.\nCooldown: Stretch hips, chest, hamstrings. Hydrate and keep form clean.`;
  return gemini(prompt, fallback);
}

export async function generateDiet({ goal, calories, dietType, hostelMode }) {
  const prompt = `Generate a daily meal plan for goal: ${goal}, calories: ${calories}, diet type: ${dietType}, hostel mode: ${hostelMode ? "yes" : "no"}. Return breakfast, lunch, snack, dinner, calories and practical swaps.`;
  const fallback = `Breakfast: Oats, fruit, curd.\nLunch: Rice/roti, dal, vegetables, protein.\nSnack: Nuts or sprouts.\nDinner: Light protein bowl with vegetables.\nTarget: ${calories || 2000} kcal. ${hostelMode ? "Choose mess-friendly protein and fruit options." : "Prep simple whole-food meals."}`;
  return gemini(prompt, fallback);
}

export async function coachChat({ message, user }) {
  const prompt = `You are GymGenie AI, a friendly practical fitness coach. User profile: ${JSON.stringify(user || {})}. Reply warmly, safely, and concisely to: ${message}`;
  const fallback = "I’m here with you. Keep today simple: one focused workout, one protein-rich meal, and a short walk. Small wins compound fast.";
  return gemini(prompt, fallback);
}

