import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        wordchange: {
          "10%": { transform: "translateY(-100%)" },
          "20%": { transform: "translateY(-200%)" },
          "30%": { transform: "translateY(-300%)" },
          "40%": { transform: "translateY(-400%)" },
          "50%": { transform: "translateY(-500%)" },
          "60%": { transform: "translateY(-600%)" },
          "70%": { transform: "translateY(-700%)" },
          "80%": { transform: "translateY(-800%)" },
          "90%": { transform: "translateY(-900%)" },
          "100%": { transform: "translateY(-1000%)" },
        },
      },
      animation: {
        wordchange: "wordchange 20s infinite",
      },
    },
  },
  plugins: [],
};
export default config;
