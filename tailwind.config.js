/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'comic-yellow': '#FFF9C4',
        'comic-orange': '#FFB74D',
        'comic-lime': '#DCE775',
        'comic-cyan': '#4DD0E1',
        'comic-pink': '#F48FB1',
        'comic-purple': '#CE93D8',
        'comic-bg': '#FFF8E1',
      },
      boxShadow: {
        'comic': '4px 4px 0px rgba(0,0,0,0.2)',
        'comic-lg': '6px 6px 0px rgba(0,0,0,0.2)',
      },
      fontFamily: {
        'comic': ['"Comic Sans MS"', 'cursive', 'sans-serif'],
      },
    },
  },
  plugins: [],
}