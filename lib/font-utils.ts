// Comic Book Font Utility Classes - That's All Folks Style!
// Use these classes to apply hand-drawn typography

export const COMIC_FONTS = {
  // Hero Titles - BIG IMPACT! (h1)
  hero: "font-['Bangers','Russo_One'] tracking-wide uppercase",
  
  // Section Headers (h2)  
  header: "font-['Luckiest_Guy','Russo_One'] tracking-normal",
  
  // Subheaders (h3)
  subheader: "font-['Carter_One','Russo_One']",
  
  // Button Text - PUNCHY!
  button: "font-['Titan_One','Russo_One'] tracking-wide uppercase",
  
  // Numbers & Stats - CHUNKY
  number: "font-['Rubik_Mono_One','Russo_One'] tabular-nums",
  
  // Tags & Badges - STICKERS
  tag: "font-['Lilita_One','Russo_One'] tracking-wide uppercase",
  
  // Body Text - FRIENDLY
  body: "font-['Chewy','Russo_One']",
  
  // Special Effects - ACTION WORDS!
  pow: "font-['Bungee_Shade','Bangers'] tracking-wider uppercase",
  boom: "font-['Shrikhand','Russo_One'] tracking-wide uppercase",
  zap: "font-['Bungee_Inline','Bangers'] tracking-wider uppercase",
  
  // Labels
  label: "font-['Lilita_One','Russo_One'] tracking-wide uppercase text-sm",
};

// Helper function to get font class
export function getComicFont(type: keyof typeof COMIC_FONTS): string {
  return COMIC_FONTS[type];
}

// Inline Style Objects - Hand-Drawn Comic Style!
export const COMIC_FONT_STYLES = {
  hero: {
    fontFamily: "'Bangers', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
    transform: 'scaleY(1.1)',
  },
  header: {
    fontFamily: "'Luckiest Guy', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.02em',
  },
  button: {
    fontFamily: "'Titan One', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.02em',
    textTransform: 'uppercase' as const,
  },
  number: {
    fontFamily: "'Rubik Mono One', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
    fontVariantNumeric: 'tabular-nums' as const,
  },
  tag: {
    fontFamily: "'Lilita One', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.03em',
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: "'Chewy', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
  },
  pow: {
    fontFamily: "'Bungee Shade', 'Bangers', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.1em',
    textTransform: 'uppercase' as const,
    transform: 'rotate(-8deg) scaleY(1.1)',
  },
  boom: {
    fontFamily: "'Shrikhand', 'Russo One', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.08em',
    textTransform: 'uppercase' as const,
    transform: 'scaleY(1.15) rotate(3deg)',
  },
  zap: {
    fontFamily: "'Bungee Inline', 'Bangers', cursive, sans-serif",
    fontWeight: 400,
    letterSpacing: '0.12em',
    textTransform: 'uppercase' as const,
    transform: 'skewX(-5deg)',
  },
};
