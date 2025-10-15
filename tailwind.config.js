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
        // ENOUGH Brand Colors - Professional & Bold
        'enough-yellow': '#F5C61A',
        'enough-gold': '#FFD700',
        'enough-black': '#000000',
        'enough-white': '#FFFEF7',
        'enough-cream': '#FFF9E5',
        'enough-gray': '#333333',
        'enough-light-gray': '#CCCCCC',
        // Status colors
        'enough-success': '#22C55E',
        'enough-warning': '#F59E0B',
        'enough-error': '#EF4444',
        'enough-info': '#3B82F6',
      },
      boxShadow: {
        'enough': '0 4px 0px #000',
        'enough-lg': '0 8px 0px #000',
        'enough-xl': '0 12px 0px #000',
        'enough-float': '0 4px 0px #000, 0 6px 20px rgba(0,0,0,0.2)',
        'enough-hover': '0 6px 0px #000, 0 8px 25px rgba(0,0,0,0.25)',
        'enough-active': '0 2px 0px #000, 0 3px 10px rgba(0,0,0,0.2)',
        'enough-glow': '0 0 30px rgba(245, 198, 26, 0.6), 0 4px 0px #000',
      },
      backgroundImage: {
        'enough-grid': 'linear-gradient(rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.03) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '20px 20px',
      },
    },
  },
  plugins: [],
}