/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f7f6',
          100: '#e1e9e5',
          200: '#c3d5cd',
          300: '#9db9af',
          400: '#759c8f',
          500: '#578073',
          600: '#436660',
          700: '#385350',
          800: '#314442',
          900: '#2c3b39',
        },
        secondary: {
          50: '#fdf8f6',
          100: '#f7e8e1',
          200: '#f0d1c3',
          300: '#e4b09d',
          400: '#d68468',
          500: '#c65d3e',
          600: '#b44b31',
          700: '#963d2b',
          800: '#7c352a',
          900: '#683026',
        },
      },
      fontFamily: {
        sans: ['Inter var', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
