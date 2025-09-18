/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        // Museum Primary - Deep Navy
        'museum-primary': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#1e40af',
          700: '#1e3a8a',
          800: '#1e3a8a',
          900: '#1a365d',
        },
        // Museum Secondary - Warm Gold
        'museum-gold': {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#d4af37',
          600: '#b8860b',
          700: '#92660a',
          800: '#744d08',
          900: '#5a3807',
        },
        // Museum Neutrals
        'museum-neutral': {
          50: '#fafafa',
          100: '#f7fafc',
          200: '#edf2f7',
          300: '#e2e8f0',
          400: '#cbd5e0',
          500: '#a0aec0',
          600: '#718096',
          700: '#4a5568',
          800: '#2d3748',
          900: '#1a202c',
        },
      },
      backgroundImage: {
        'museum-gradient': 'linear-gradient(135deg, #f7fafc 0%, #edf2f7 100%)',
        'museum-hero': 'linear-gradient(135deg, #1a365d 0%, #2d3748 100%)',
        'museum-card': 'linear-gradient(135deg, #ffffff 0%, #f7fafc 100%)',
      },
    },
  },
  plugins: [],
};
