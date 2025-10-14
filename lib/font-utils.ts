// Professional Comic Font Utility Classes
// Use these classes to apply consistent typography across the app

export const COMIC_FONTS = {
  // Hero Titles - Maximum Impact (h1)
  hero: "font-['Passion_One','Russo_One'] font-black tracking-wide uppercase",
  
  // Section Headers (h2)
  header: "font-['Exo_2','Russo_One'] font-extrabold tracking-tight",
  
  // Subheaders (h3)
  subheader: "font-['Fredoka','Ubuntu'] font-bold",
  
  // Button Text - Action!
  button: "font-['Exo_2','Bebas_Neue'] font-black tracking-wider uppercase",
  
  // Numbers & Stats - Clear & Bold
  number: "font-['Russo_One','Poppins'] font-black tabular-nums",
  
  // Tags & Badges - Compact Power
  tag: "font-['Exo_2'] font-black tracking-wider uppercase",
  
  // Body Text - Readable
  body: "font-['Ubuntu','Comfortaa'] font-medium",
  
  // Special Effects
  pow: "font-['Bungee','Passion_One'] font-black tracking-widest uppercase",
  boom: "font-['Righteous','Russo_One'] font-black tracking-wider uppercase",
  zap: "font-['Bebas_Neue','Archivo_Black'] font-black tracking-wide uppercase",
  
  // Labels - Clear Info
  label: "font-['Exo_2','Ubuntu'] font-bold tracking-wide uppercase text-sm",
};

// Helper function to get font class
export function getComicFont(type: keyof typeof COMIC_FONTS): string {
  return COMIC_FONTS[type];
}

// Style objects for inline styles (when needed)
export const COMIC_FONT_STYLES = {
  hero: {
    fontFamily: "'Passion One', 'Russo One', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
  },
  header: {
    fontFamily: "'Exo 2', 'Russo One', sans-serif",
    fontWeight: 800,
    letterSpacing: '0.01em',
  },
  button: {
    fontFamily: "'Exo 2', 'Bebas Neue', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  number: {
    fontFamily: "'Russo One', 'Poppins', sans-serif",
    fontWeight: 900,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  tag: {
    fontFamily: "'Exo 2', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: "'Ubuntu', 'Comfortaa', sans-serif",
    fontWeight: 500,
  },
  pow: {
    fontFamily: "'Bungee', 'Passion One', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  },
  boom: {
    fontFamily: "'Righteous', 'Russo One', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  },
  zap: {
    fontFamily: "'Bebas Neue', 'Archivo Black', sans-serif",
    fontWeight: 900,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
  },
};
