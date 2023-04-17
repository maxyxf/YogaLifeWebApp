/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        lightBrown: "#c2b8a8",
      },
    },
    plugins: [
      require("@tailwindcss/aspect-ratio"),
      require("@tailwindcss/forms"),
      require("@tailwindcss/typography"),
      require("@tailwindcss/aspect-ratio"),
    ],
  },
};
