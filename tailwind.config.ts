import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontSize: {
        xs: ["0.8125rem", { lineHeight: "1.0625rem" }], // 13px (was 12px)
        sm: ["0.9375rem", { lineHeight: "1.3125rem" }], // 15px (was 14px)
        base: ["1.0625rem", { lineHeight: "1.5625rem" }], // 17px (was 16px)
        lg: ["1.1875rem", { lineHeight: "1.8125rem" }], // 19px (was 18px)
        xl: ["1.3125rem", { lineHeight: "1.8125rem" }], // 21px (was 20px)
        "2xl": ["1.5625rem", { lineHeight: "2.0625rem" }], // 25px (was 24px)
        "3xl": ["1.9375rem", { lineHeight: "2.3125rem" }], // 31px (was 30px)
        "4xl": ["2.3125rem", { lineHeight: "2.5625rem" }], // 37px (was 36px)
        "5xl": ["3.0625rem", { lineHeight: "1" }], // 49px (was 48px)
        "6xl": ["3.8125rem", { lineHeight: "1" }], // 61px (was 60px)
        "7xl": ["4.5625rem", { lineHeight: "1" }], // 73px (was 72px)
        "8xl": ["6.0625rem", { lineHeight: "1" }], // 97px (was 96px)
        "9xl": ["8.0625rem", { lineHeight: "1" }], // 129px (was 128px)
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Custom tokens esposti come classi Tailwind
        "terracotta-light": "hsl(var(--terracotta-light))",
        "maiolica-light": "hsl(var(--maiolica-light))",
        "warm-stone": "hsl(var(--warm-stone))",
        cream: "hsl(var(--cream))",
      },
      fontFamily: {
        // font-heading → Fraunces (serif espressivo, usato in h1-h6 e font-heading)
        heading: ["Fraunces", "Georgia", "serif"],
        // font-sans → Source Sans 3 (body, invariato)
        sans: ["Source Sans 3", "system-ui", "sans-serif"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
