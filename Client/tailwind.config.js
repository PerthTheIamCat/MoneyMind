/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      animation: {
        "spin-ease": "spin 1s ease-in-out infinite",
        "pulse-ease": "pulse 1s ease-in-out infinite",
      }
    },
  },
  plugins: [],
}