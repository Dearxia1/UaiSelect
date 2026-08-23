/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,html}",
    "./src/sidepanel/**/*.{js,ts,jsx,tsx,html}",
    "./src/popup/**/*.{js,ts,jsx,tsx,html}"
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        dark: {
          bg: '#0f172a',
          card: '#1e293b',
          border: '#334155',
          hover: '#273549',
          text: '#f8fafc',
          muted: '#94a3b8'
        }
      }
    },
  },
  plugins: [],
}
