/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        surface: {
          950: "#030712",
          900: "#07111e",
          800: "#0b1728"
        }
      },
      boxShadow: {
        glow: "0 0 60px rgba(52, 211, 153, 0.18)",
        cyan: "0 0 50px rgba(34, 211, 238, 0.18)"
      }
    }
  },
  plugins: []
};
