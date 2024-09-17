/** @type {import('tailwindcss').Config} */
const { withUt } = require("uploadthing/tw");

module.exports = withUt({
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",

    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        primary: "#16a34a",
        secondary: "#15803d",
        third: "#116031",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#16a34a",
          "base-100": "#ffffff",
        },
      },
    ],
  },
});
