/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["*"],
  purge: ['./**/*.html', './**/*.scss'],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
}

