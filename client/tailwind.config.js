/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary, #1E3A5F)',
        secondary: 'var(--color-secondary, #2D5A87)',
        accent: 'var(--color-accent, #E8A838)'
      }
    }
  },
  plugins: []
};
