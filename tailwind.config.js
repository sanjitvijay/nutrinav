/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx}", 
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'), require('@tailwindcss/typography')
  ],
  daisyui: {
    themes: ["light", "dark",
      {
        mytheme: {
          "primary": "#515B39",
          "secondary": "#F2604B",
          "accent": "#6CA369",
          "neutral": "#000000",
          "base-100": "#FFFFFF",
          "info": "#00aeff",
          "success": "#44f600",
          "warning": "#efc100",
          "error": "#ff6c6c",
        }
      }]
  }
}

