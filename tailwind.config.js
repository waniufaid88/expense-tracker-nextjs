/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme"); // Import default theme

module.exports = {
  theme: {
    extend: {
      fontFamily: {
        // Creates the 'font-display' utility class
        display: ["Oswald", "sans-serif"],

        // Overrides or extends the default 'font-sans' utility
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
