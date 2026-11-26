export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        paper: '#F7F7F5',
        ink: '#111111',
        obsidian: '#0A0A0A',
        stone: '#E5E5E0',
      },
    },
  },
  plugins: [],
};
