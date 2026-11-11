import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors (per design charter)
        green: '#039846', // Identité principale
        'green-dark': '#026b30',
        'green-pale': '#DDF4E5',
        orange: '#E56001', // Appels ponctuels
        'orange-dark': '#A24400',
        'orange-pale': '#FFF0E2',
        // Status colors
        red: '#B42318',
        'red-pale': '#FDE9E7',
        gold: '#9A7416',
        'gold-pale': '#FBF3D9',
        // Grayscale
        ink: '#1F2937', // Textes + titres
        mute: '#5B6573', // Textes secondaires
        line: '#E2E5E9', // Borders
        soft: '#F3F4F6', // Fonds secondaires
        
        // Legacy names for compatibility
        brand: {
          primary: '#039846',
          accent: '#E56001',
          'light-green': '#DDF4E5',
          'light-orange': '#FFF0E2',
        },
        neutral: {
          dark: '#1F2937',
          light: '#F3F4F6',
        },
      },
      borderRadius: {
        base: '10px', // Default radius
        card: '12px', // Cards
        button: '10px', // Buttons
      },
      boxShadow: {
        card: '0 10px 30px rgba(31, 41, 55, 0.08)',
        'card-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['var(--font-montserrat)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-montserrat)', 'system-ui', '-apple-system', 'sans-serif'],
        body: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      lineHeight: {
        tight: '1.2', // Headings
        normal: '1.55', // Body
      },
      fontSize: {
        xs: ['0.78rem', { lineHeight: '1.2' }], // eyebrow
        sm: ['0.86rem', { lineHeight: '1.55' }],
        base: ['0.92rem', { lineHeight: '1.55' }], // Button text
        body: ['15px', { lineHeight: '1.55' }],
        lg: ['1.05rem', { lineHeight: '1.2' }], // h3
        xl: ['1.4rem', { lineHeight: '1.2' }], // h2
        '2xl': ['1.9rem', { lineHeight: '1.2' }],
        '3xl': ['2rem', { lineHeight: '1.2' }],
        '4xl': ['3.25rem', { lineHeight: '1.2' }], // h1
      },
      spacing: {
        gutter: 'max(16px, env(safe-area-inset-left, 0px))',
      },
    },
  },
  plugins: [],
};

export default config;
