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
        'comic-yellow': '#FFD54F',
        'comic-orange': '#FFB74D',
        'comic-pink': '#FF80AB',
        'comic-purple': '#BA68C8',
        'comic-cyan': '#4DD0E1',
        'comic-lime': '#AED581',
      },
      boxShadow: {
        'comic': '4px 4px 0px #000',
        'comic-lg': '8px 8px 0px #000',
      },
    },
  },
  plugins: [],
}