/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary": { DEFAULT: "#1B6392", dark: "#0F4268", light: "#2A8BCE" },
        "accent": { DEFAULT: "#E8A838", light: "#F5C56A" },
        "bg": "#F8F9FA",
        "text": "#1A1A2E",
        "text-secondary": "#5A5A72",
        "text-muted": "#8E8EA0",
        "border": "#E8E8EE",
        "card": "#FFFFFF",
        "pros": "#2D6A4F",
        "cons": "#D62828",
      },
      borderRadius: { lg: "12px", md: "8px", sm: "6px" }
    }
  },
  plugins: []
};
