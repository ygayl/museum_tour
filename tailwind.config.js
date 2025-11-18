/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      colors: {
        // Museum Primary - Deep Navy (#1C2A39 base)
        'museum-primary': {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#1C2A39',
        },
        // Museum Secondary - Terracotta (#B86B4B base)
        'museum-terracotta': {
          50: '#fdf5f3',
          100: '#fbe8e3',
          200: '#f7d1c7',
          300: '#f0b3a1',
          400: '#e48f73',
          500: '#B86B4B',
          600: '#a35539',
          700: '#87432d',
          800: '#6d3524',
          900: '#5a2b1e',
        },
        // Museum Neutrals (with charcoal #222222)
        'museum-neutral': {
          50: '#FAF8F3',
          100: '#f7f5f0',
          200: '#eee9e0',
          300: '#e0d8cc',
          400: '#cdc3b3',
          500: '#a49989',
          600: '#7d6f5f',
          700: '#5c5044',
          800: '#3d3630',
          900: '#222222',
        },
      },
      backgroundImage: {
        'cream-gradient': 'linear-gradient(135deg, #FAF8F3 0%, #F3EFEA 100%)',
        'museum-hero': 'linear-gradient(135deg, #1C2A39 0%, #243b53 100%)',
        'museum-card': 'linear-gradient(135deg, #ffffff 0%, #FAF8F3 100%)',
        'grid-texture': `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23222222' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      },
    },
  },
  plugins: [],
};
