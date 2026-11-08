/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#0a2540', 800: '#12345a', 700: '#1c4673', 600: '#2d5a8a' },
        teal: { 50: '#e8f7f6', 100: '#c9ece9', 400: '#2bb5ab', 500: '#0e9f94', 600: '#0b857c', 700: '#096b64' },
        sky: { 25: '#f6faff', 50: '#eef5fd', 100: '#dfeafa', 200: '#c5d9f2' },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 10px 40px -12px rgba(10,37,64,0.15)',
        lift: '0 24px 60px -20px rgba(10,37,64,0.28)',
      },
    },
  },
  plugins: [],
}
