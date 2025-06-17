/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}",],// this help every file and folder in src can use tailwind css in jsx
    theme: {
      extend: {
       keyframes: {
        scrollUp: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      animation: {
        scrollUp: 'scrollUp 5s linear infinite',
      },



      },
    },
    plugins: [],
  }
  