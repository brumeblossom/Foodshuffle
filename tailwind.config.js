/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Fraunces', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        text: 'var(--text)',
        'text-muted': 'var(--text-muted)',
        primary: 'var(--primary)',
        'primary-fg': 'var(--primary-fg)',
        accent: 'var(--accent)',
        'accent-fg': 'var(--accent-fg)',
        danger: 'var(--danger)',
        'danger-fg': 'var(--danger-fg)',
        highlight: 'var(--highlight)',
        'highlight-fg': 'var(--highlight-fg)',
        success: 'var(--success)',
        'success-fg': 'var(--success-fg)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}
