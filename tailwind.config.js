/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
module.exports = {
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#00617a",
        secondary: "#EC7404",
      },
    },
  },
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#00617a",
          secondary: "#EC7404",
          accent: "#37cdbe",
          neutral: "#3d4451",
          warning: "#ff0000",
          "base-100": "#ffffff",
        },
      },
    ],
  },
  plugins: [require("daisyui")],
};
