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
        // 2026 Modern Comic Palette - Ultra Vibrant
        'comic-yellow': '#FFE030',
        'comic-orange': '#FF6B35',
        'comic-pink': '#FF006E',
        'comic-purple': '#8338EC',
        'comic-cyan': '#06FFF0',
        'comic-lime': '#CCFF00',
        'comic-blue': '#3A86FF',
        'comic-red': '#FB5607',
        'comic-green': '#06D6A0',
        'comic-indigo': '#5E60CE',
        // Accent colors
        'comic-neon-pink': '#FF10F0',
        'comic-neon-blue': '#00F5FF',
        'comic-neon-green': '#39FF14',
        'comic-dark': '#1A1A2E',
        'comic-light': '#FFFEF7',
      },
      boxShadow: {
        'comic': '6px 6px 0px #000',
        'comic-lg': '10px 10px 0px #000',
        'comic-xl': '14px 14px 0px #000',
        'comic-neon': '0 0 20px rgba(255, 16, 240, 0.6), 6px 6px 0px #000',
        'comic-glow': '0 0 30px rgba(255, 224, 48, 0.8), 8px 8px 0px #000',
      },
      backgroundImage: {
        'comic-dots': 'radial-gradient(circle, #000 1px, transparent 1px)',
        'comic-lines': 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(0,0,0,0.1) 10px, rgba(0,0,0,0.1) 20px)',
      },
      backgroundSize: {
        'dots-sm': '8px 8px',
        'dots-md': '12px 12px',
        'dots-lg': '16px 16px',
      },
    },
  },
  plugins: [],
}