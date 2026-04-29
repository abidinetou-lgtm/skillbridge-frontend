/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        ink:       '#1A1410',
        warm:      '#C8864B',
        'warm-dk': '#8C5A1E',
        night:     '#252840',
        sage:      '#3D5C28',
      },
    },
  },
  plugins: [],
}