/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.tsx", "./index.ts", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#07080b",
          900: "#0c0e13",
          850: "#11141b",
          800: "#171b24",
          700: "#232936",
          600: "#333c4d",
          500: "#4b5768",
        },
        acid: {
          400: "#5ef2b0",
          500: "#2fe39a",
          600: "#12c47e",
        },
        ember: {
          400: "#ff8a5c",
          500: "#ff6b35",
        },
        sky: {
          400: "#5cc8ff",
          500: "#2fa8f0",
        },
      },
      fontFamily: {
        mono: ["Menlo", "Courier New", "monospace"],
      },
    },
  },
  plugins: [],
};
