/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2C3E50',
          light: '#34495E',
          dark: '#243342'
        },
        secondary: {
          DEFAULT: '#3498DB',
          light: '#5DADE2',
          dark: '#2980B9'
        },
        accent: {
          DEFAULT: '#E74C3C',
          light: '#EC7063',
          dark: '#C0392B'
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Open Sans', 'sans-serif']
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}