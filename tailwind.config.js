/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./views/**/*.ejs", "./public/**/*.html", "./public/**/*.js"],
  theme: { 
    extend: {} 
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("daisyui")  
  ],
  daisyui: {
    themes: [
      {
        mydark: {
          "primary": "#9333ea",        
          "secondary": "#7e22ce",      
          "accent": "#a855f7",         
          "neutral": "#1e1e1e",        
          "base-100": "#000000",       
          "base-content": "#ffffff",  
          "info": "#3b82f6",
          "success": "#10b981",
          "warning": "#fbbf24",
          "error": "#ef4444"
        },
      },
    ],
  },
};

