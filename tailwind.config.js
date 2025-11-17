/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
    },
    extend: {
      colors: {
        // Warm Cultural Palette
        terracotta: {
          50: '#fdf2e9',
          100: '#f9e0c1',
          200: '#f3c895',
          300: '#edaa6b',
          400: '#e78d47',
          500: '#D2691E', // Primary terracotta
          600: '#b8551a',
          700: '#994516',
          800: '#7a3712',
          900: '#5c290e',
        },
        saffron: {
          50: '#fff5e6',
          100: '#ffe4b3',
          200: '#ffd380',
          300: '#ffc24d',
          400: '#ffb11a',
          500: '#FF9933', // Primary saffron
          600: '#e6861a',
          700: '#cc7300',
          800: '#b36000',
          900: '#994d00',
        },
        curry: {
          50: '#f9f5f0',
          100: '#f0e6d6',
          200: '#e6d3b8',
          300: '#d4b896',
          400: '#c19a6b',
          500: '#b8956a',
          600: '#a6825a',
          700: '#8c6f4f',
          800: '#735c44',
          900: '#5a4939',
        },
        cream: {
          50: '#fffdf7',
          100: '#fffaeb',
          200: '#fff5d6',
          300: '#ffefc2',
          400: '#ffe9ad',
          500: '#FFF8DC', // Primary cream
          600: '#e6dfc6',
          700: '#ccc6b0',
          800: '#b3ad9a',
          900: '#999484',
        },
        warmbrown: {
          50: '#f5f2ef',
          100: '#e8ddd4',
          200: '#d6c7b8',
          300: '#c4b19c',
          400: '#b29b80',
          500: '#8B4513', // Primary warm brown
          600: '#7a3d11',
          700: '#69350f',
          800: '#582d0d',
          900: '#47250b',
        },
        deepgreen: {
          50: '#f0f8f0',
          100: '#d8eed8',
          200: '#b8e0b8',
          300: '#90d090',
          400: '#60bc60',
          500: '#228B22', // Primary deep green
          600: '#1e7b1e',
          700: '#1a6b1a',
          800: '#165b16',
          900: '#124b12',
        },
        // Additional cultural colors
        marigold: '#FFA500',
        turmeric: '#C8A951',
        cardamom: '#8FBC8F',
        cinnamon: '#D2691E',
        paprika: '#A0522D',
      },
      fontFamily: {
        'sans': ['Poppins', 'ui-sans-serif', 'system-ui'],
        'serif': ['Merriweather', 'ui-serif', 'serif'],
        'script': ['Dancing Script', 'cursive'],
      },
      animation: {
        'steam-rise': 'steam 3s ease-in-out infinite',
        'heart-beat': 'heartbeat 1.5s ease-in-out infinite',
        'spice-sprinkle': 'sprinkle 2s ease-in-out infinite',
        'gentle-float': 'float 6s ease-in-out infinite',
        'warm-glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        steam: {
          '0%': { opacity: '0', transform: 'translateY(0px)' },
          '50%': { opacity: '0.6', transform: 'translateY(-10px)' },
          '100%': { opacity: '0', transform: 'translateY(-20px)' },
        },
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
        sprinkle: {
          '0%': { transform: 'rotate(0deg) scale(1)' },
          '50%': { transform: 'rotate(180deg) scale(1.1)' },
          '100%': { transform: 'rotate(360deg) scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-5px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(210, 105, 30, 0.3)' },
          '100%': { boxShadow: '0 0 20px rgba(210, 105, 30, 0.6)' },
        },
      },
      borderRadius: {
        'kitchen': '1.5rem', // Extra rounded for soft, approachable feel
        'plate': '50%', // Perfect circles for avatars and icons
        'leaf': '0 50% 0 50%', // Organic, leaf-like shapes
      },
      boxShadow: {
        'kitchen-soft': '0 4px 20px rgba(139, 69, 19, 0.1)',
        'food-card': '0 8px 30px rgba(210, 105, 30, 0.15)',
        'warm-glow': '0 0 30px rgba(255, 153, 51, 0.3)',
      },
      backgroundImage: {
        'spice-pattern': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><circle cx=\"20\" cy=\"20\" r=\"2\" fill=\"%23D2691E\" opacity=\"0.3\"/><circle cx=\"80\" cy=\"40\" r=\"1.5\" fill=\"%23FF9933\" opacity=\"0.4\"/><circle cx=\"40\" cy=\"80\" r=\"1\" fill=\"%23228B22\" opacity=\"0.3\"/></svg>')",
        'hand-painted': "url('data:image/svg+xml,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 100 100\"><path d=\"M10,50 Q30,30 50,50 T90,50\" stroke=\"%23D2691E\" stroke-width=\"1\" fill=\"none\" opacity=\"0.2\"/></svg>')",
      },
    },
  },
  plugins: [],
};
