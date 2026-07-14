/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f0f7ff",
          100: "#e0effe",
          200: "#b9dffd",
          300: "#7cc5fd",
          400: "#36a7f8",
          500: "#0c8ce9",
          600: "#006fc7",
          700: "#0158a1",
          800: "#064b85",
          900: "#0b3f6e",
          950: "#072849",
        },
        accent: {
          50: "#fef7ee",
          100: "#fdedd6",
          200: "#fad7ac",
          300: "#f6ba77",
          400: "#f19340",
          500: "#ed751a",
          600: "#de5b10",
          700: "#b84410",
          800: "#933615",
          900: "#772f14",
        },
        field: {
          pine: "#143529",
          moss: "#1f4d3a",
          canopy: "#2f6b4f",
          wheat: "#d4b06a",
          dusk: "#0f1c18",
          mist: "#e8efe9",
          paper: "#f4f1e8",
          ink: "#1a2420",
          grit: "#7a3e2b",
        },
      },
      fontFamily: {
        fieldDisplay: ["var(--font-field-display)", "Georgia", "serif"],
        fieldSans: ["var(--font-field-sans)", "system-ui", "sans-serif"],
      },
      keyframes: {
        fieldRise: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fieldPulse: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        fieldRise: "fieldRise 0.55s ease-out both",
        fieldPulse: "fieldPulse 2.8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
