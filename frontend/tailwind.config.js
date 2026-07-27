/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: '#0A0E17',
          card: '#111827',
          sidebar: '#0D1322',
          border: '#1E293B',
          accent: '#06B6D4', // cyan-500
          danger: '#F43F5E', // rose-500
          warning: '#F59E0B', // amber-500
          success: '#10B981', // emerald-500
          purple: '#8B5CF6', // violet-500
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glow-cyan': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-danger': '0 0 15px -3px rgba(244, 63, 94, 0.3)',
        'glow-success': '0 0 15px -3px rgba(16, 185, 129, 0.3)',
      }
    },
  },
  plugins: [],
}
