// Design tokens for the EaseMyTrip Planner app
// Colors are managed via Tailwind CSS variables in index.css

export const tokens = {
  colors: {
    // Reference to CSS variables
    primary: 'hsl(var(--primary))',
    secondary: 'hsl(var(--secondary))',
    accent: 'hsl(var(--accent))',
    background: 'hsl(var(--background))',
    foreground: 'hsl(var(--foreground))',
  },
  
  spacing: {
    page: '1.5rem',
    section: '3rem',
    card: '1.5rem',
  },
  
  gradients: {
    hero: 'var(--gradient-hero)',
    card: 'var(--gradient-card)',
  },
};
