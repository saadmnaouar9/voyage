/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  safelist: ['btn-primary', 'btn-light', 'btn-ghost', 'btn-outline'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#040b1c', 900: '#07142f', 800: '#0b1f47', 700: '#12306a' },
        ocean: { 300: '#7cc4f2', 400: '#43a8ea', 500: '#1b86d6', 600: '#0f6bb5' },
        sand: { 50: '#fbf8f2', 100: '#f4eee0', 200: '#e9dec6', 300: '#d8c8a5' },
      },
      fontFamily: {
        display: ['Poppins', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { widest2: '0.32em' },
      boxShadow: {
        glow: 'none',
        card: 'none',
      },
    },
  },
  plugins: [],
}
