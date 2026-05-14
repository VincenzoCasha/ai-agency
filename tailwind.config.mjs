/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          elevated: 'var(--color-bg-elevated)',
          light: 'var(--color-bg-light)',
          'light-soft': 'var(--color-bg-light-soft)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
          inverse: 'var(--color-text-inverse)',
        },
        accent: {
          DEFAULT: 'var(--color-accent)',
          hover: 'var(--color-accent-hover)',
          soft: 'var(--color-accent-soft)',
        },
        gold: 'var(--color-gold)',
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        border: {
          DEFAULT: 'var(--color-border)',
          strong: 'var(--color-border-strong)',
        },
        crudo: {
          saffron: 'var(--color-crudo-saffron)',
          'saffron-grout': 'var(--color-crudo-saffron-grout)',
          terracota: 'var(--color-crudo-terracota)',
          'terracota-deep': 'var(--color-crudo-terracota-deep)',
          bone: 'var(--color-crudo-bone)',
          coral: 'var(--color-accent)',
          vine: 'var(--color-vine)',
          petrol: 'var(--color-petrol)',
        },
      },
      fontFamily: {
        display: ['Fraunces', '"Cormorant Garamond"', '"Times New Roman"', 'serif'],
        body: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        none: '0',
        sm: '2px',
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
        pill: '999px',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(108,64,80,0.06), 0 8px 24px rgba(108,64,80,0.10)',
        elevated: '0 1px 2px rgba(108,64,80,0.08), 0 20px 48px rgba(108,64,80,0.18)',
      },
      letterSpacing: {
        eyebrow: '0.16em',
      },
      maxWidth: {
        prose: '70ch',
      },
    },
  },
  plugins: [],
};
