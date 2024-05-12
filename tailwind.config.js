const plugin = require("tailwindcss/plugin");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.{hbs,html}"],
  theme: {
    extend: {
      colors: {
        skin: {
          primary: "#1f4b8e",
          primary_dark: "#102a52",
          secondary: "#182430",
          secondary_dark: "#060c11",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
    plugin(function ({ addUtilities, theme }) {
      const newUtilities = {
        ".custom_scrollbar": {
          ".custom_scrollbar::-webkit-scrollbar": { width: "6px" },
          ".custom_scrollbar::-webkit-scrollbar-track": {
            background: theme("bg-secondary"),
          },
          ".custom_scrollbar::-webkit-scrollbar-thumb": { background: "#888" },
          ".custom_scrollbar::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        },
      };

      addUtilities(newUtilities, ["responsive", "hover"]);
    }),
  ],
};
