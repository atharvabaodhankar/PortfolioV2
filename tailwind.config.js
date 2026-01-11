/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#1a1a1a",
        "background-light": "#ffffff",
        "background-dark": "#0a0a0a",
        "text-light": "#1a1a1a",
        "text-dark": "#f0f0f0",
        "accent-light": "#f4f4f5",
        "accent-dark": "#27272a",
      },
      fontFamily: {
        'arsenica': ['ArsenicaDemibold', 'serif'],
        'fontstyle': ['FontStyleNew', 'sans-serif'],
        'display': ['Bodoni Moda', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.19, 1, 0.22, 1)',
      },
      boxShadow: {
        'soft': '0 20px 40px -15px rgba(0, 0, 0, 0.1)',
        'glow-dark': '0 0 50px -10px rgba(255, 255, 255, 0.05)',
        'portrait': '20px 20px 60px #bebebe, -20px -20px 60px #ffffff',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 4s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 0, 0, 0.1)' },
          '50%': { boxShadow: '0 0 40px rgba(0, 0, 0, 0.2)' },
        }
      }
    },
  },
  plugins: [],
}