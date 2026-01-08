/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'arsenica': ['ArsenicaDemibold', 'serif'],
        'fontstyle': ['FontStyleNew', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
