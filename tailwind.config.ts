import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "comic-yellow": "#FACC15",
        "comic-cyan": "#06B6D4",
        "comic-pink": "#EC4899",
        "comic-bg": "#F3F4F6",
      },
      fontFamily: {
        display: ["Anybody", "Impact", "Arial Black", "sans-serif"],
        body: ["Inter", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Arial", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["64px", { lineHeight: "1.1", letterSpacing: "-0.04em", fontWeight: "900" }],
        "headline-lg": ["40px", { lineHeight: "1.2", fontWeight: "900" }],
        "headline-lg-mobile": ["32px", { lineHeight: "1.2", fontWeight: "900" }],
        "headline-md": ["24px", { lineHeight: "1.3", fontWeight: "800" }],
        "body-lg": ["18px", { lineHeight: "1.6", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-bold": ["14px", { lineHeight: "1", letterSpacing: "0.05em", fontWeight: "700" }],
      },
      spacing: {
        gutter: "24px",
        "margin-mobile": "16px",
        "margin-desktop": "48px",
      },
      boxShadow: {
        comic: "5px 5px 0px 0px rgba(0,0,0,1)",
        "comic-sm": "3px 3px 0px 0px rgba(0,0,0,1)",
        "comic-lg": "8px 8px 0px 0px rgba(0,0,0,1)",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(30px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      animation: {
        slideUp: "slideUp 0.2s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
