import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      keyframes: {
        slideIn: {
          from: { transform: 'translateX(100%)', opacity: '0' },
          to: { transform: 'translateX(0)', opacity: '1' },
        },
        slideOut: {
          from: { transform: 'translateX(0)', opacity: '1' },
          to: { transform: 'translateX(100%)', opacity: '0' },
        },
        pulse: {
          '0%, 100%': { backgroundColor: 'rgba(239, 68, 68, 0.9)' },
          '50%': { backgroundColor: 'rgba(220, 38, 38, 0.9)' },
        },
        flashBorder: {
          '0%, 100%': { 
            boxShadow: '0 0 0 0 rgba(239, 68, 68, 0)' 
          },
          '50%': { 
            boxShadow: '0 0 0 6px rgba(239, 68, 68, 0.5)' 
          }
        },
        screenFlash: {
          '0%, 100%': { 
            boxShadow: 'inset 0 0 0 0 rgba(239, 68, 68, 0)' 
          },
          '50%': { 
            boxShadow: 'inset 0 0 100px 0 rgba(239, 68, 68, 0.3)' 
          }
        }
      },
      animation: {
        slideIn: 'slideIn 0.5s ease-out forwards',
        slideOut: 'slideOut 0.5s ease-out forwards',
        pulse: 'pulse 2s ease-in-out infinite',
        flashBorder: 'flashBorder 2s ease-in-out infinite',
        screenFlash: 'screenFlash 2s ease-in-out infinite'
      },
    },
  },
  plugins: [],
} satisfies Config;
