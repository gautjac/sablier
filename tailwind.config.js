/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Sablier — an hourglass at dusk. Deep indigo night, warm falling sand,
        // dusk rose. Tender, spacious, never alarming.
        dusk: {
          DEFAULT: "#1c1733", // deep indigo dusk (page night)
          deep: "#15112a",
          soft: "#272147",
          veil: "#322a55",
        },
        sand: {
          DEFAULT: "#e7b98a", // warm sand
          light: "#f4e3c8",
          pale: "#f7eedd",
          deep: "#d49a63",
          dim: "#b9885d",
        },
        rose: {
          DEFAULT: "#d98a8f", // dusk rose
          soft: "#e7adb0",
          deep: "#b9636c",
        },
        bone: "#f7f1e6", // text on dark
        haze: "#b9b1cf", // muted lavender-grey text
        amber: "#e8b15e",
      },
      fontFamily: {
        // Cormorant Garamond — a graceful, breathing serif for headings & cards.
        display: ['"Cormorant Garamond"', "Georgia", "serif"],
        // Spectral — a calm reading serif.
        serif: ['"Spectral"', "Georgia", "serif"],
        // Inter — clean sans for chrome, labels, numbers.
        sans: ['"Inter"', "system-ui", "sans-serif"],
      },
      boxShadow: {
        lift: "0 18px 50px -24px rgba(0,0,0,0.55)",
        glow: "0 0 60px -20px rgba(231,185,138,0.45)",
        card: "0 24px 70px -30px rgba(0,0,0,0.7)",
      },
      keyframes: {
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        breathe: {
          "0%, 100%": { opacity: "0.55" },
          "50%": { opacity: "1" },
        },
        // a single grain of sand falling through the glass
        fall: {
          "0%": { transform: "translateY(-6px)", opacity: "0" },
          "12%": { opacity: "1" },
          "88%": { opacity: "1" },
          "100%": { transform: "translateY(120px)", opacity: "0" },
        },
        shimmer: {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "0.85" },
        },
      },
      animation: {
        riseIn: "riseIn 0.6s cubic-bezier(0.2,0.7,0.2,1) both",
        fadeIn: "fadeIn 0.8s ease-out both",
        breathe: "breathe 4.5s ease-in-out infinite",
        shimmer: "shimmer 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
