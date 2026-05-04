export const goals = ["Fat loss", "Muscle gain", "Strength", "Endurance", "Healthy lifestyle"];
export const places = ["Home", "Gym", "Hostel"];
export const diets = ["Balanced", "Vegetarian", "Vegan", "High protein", "Hostel friendly"];
export const levels = ["Beginner", "Intermediate", "Advanced"];

export function lines(text) {
  return String(text || "").split("\n").filter(Boolean);
}

