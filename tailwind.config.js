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
        // Premium Gray Scale - Apple Style
        'gray': {
          50: '#FAFAFA',
          100: '#F5F5F7',
          200: '#E8E8ED',
          300: '#D2D2D7',
          400: '#AEAEB2',
          500: '#8E8E93',
          600: '#636366',
          700: '#48484A',
          800: '#3A3A3C',
          900: '#1D1D1F',
        },
        
        // Enough Brand Colors - Premium Version
        'enough': {
          yellow: '#F5C61A',
          gold: '#FFD93D',
          amber: '#FFBF00',
          light: '#FFF9E5',
          dark: '#1D1D1F',
        },
        
        // Semantic Colors - Modern
        'success': '#34C759',
        'warning': '#FF9500',
        'error': '#FF3B30',
        'info': '#007AFF',
      },
      
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'DEFAULT': '0 1px 3px rgba(0, 0, 0, 0.04), 0 4px 8px rgba(0, 0, 0, 0.04)',
        'md': '0 2px 6px rgba(0, 0, 0, 0.06), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'lg': '0 4px 12px rgba(0, 0, 0, 0.08), 0 8px 24px rgba(0, 0, 0, 0.08)',
        'xl': '0 8px 32px rgba(0, 0, 0, 0.12), 0 16px 64px rgba(0, 0, 0, 0.08)',
        '2xl': '0 16px 64px rgba(0, 0, 0, 0.16), 0 32px 128px rgba(0, 0, 0, 0.12)',
        
        // Brand Shadows
        'enough': '0 2px 8px rgba(245, 198, 26, 0.25), 0 4px 16px rgba(245, 198, 26, 0.15)',
        'enough-lg': '0 4px 12px rgba(245, 198, 26, 0.35), 0 8px 24px rgba(245, 198, 26, 0.25)',
        
        // Glow Effects
        'glow-sm': '0 0 10px rgba(245, 198, 26, 0.3)',
        'glow': '0 0 20px rgba(245, 198, 26, 0.4)',
        'glow-lg': '0 0 30px rgba(245, 198, 26, 0.5)',
      },
      
      borderRadius: {
        'DEFAULT': '10px',
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
        'xl': '20px',
        '2xl': '24px',
      },
      
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem', letterSpacing: '-0.01em' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem', letterSpacing: '-0.01em' }],
        'base': ['1rem', { lineHeight: '1.5rem', letterSpacing: '-0.01em' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem', letterSpacing: '-0.01em' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem', letterSpacing: '-0.02em' }],
        '2xl': ['1.5rem', { lineHeight: '2rem', letterSpacing: '-0.02em' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem', letterSpacing: '-0.03em' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem', letterSpacing: '-0.03em' }],
        '5xl': ['3rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '6xl': ['3.75rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
        '7xl': ['4.5rem', { lineHeight: '1', letterSpacing: '-0.03em' }],
      },
      
      fontWeight: {
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
      },
      
      transitionTimingFunction: {
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'smooth-in': 'cubic-bezier(0.4, 0, 1, 1)',
        'smooth-out': 'cubic-bezier(0, 0, 0.2, 1)',
      },
      
      animation: {
        'slide-up': 'slideUp 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
        'fade-in': 'fadeIn 0.4s ease-out',
        'scale-in': 'scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite',
      },
      
      backdropBlur: {
        xs: '2px',
        sm: '4px',
        DEFAULT: '8px',
        md: '12px',
        lg: '16px',
        xl: '24px',
      },
    },
  },
  plugins: [],
}
