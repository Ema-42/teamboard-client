/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Habilita el modo oscuro mediante una clase
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', // Ajusta según la estructura de tu proyecto
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
