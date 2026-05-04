import dotenv from "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`GymGenie AI API running on port ${PORT}`);
});

