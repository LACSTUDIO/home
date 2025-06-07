/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{html,js}",
    "./index.html",
    "./js/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0062F5',
          dark: '#0050CC'
        },
        secondary: '#f8fafc',
        accent: '#00C2FF',
        text: {
          DEFAULT: '#0A1F44',
          muted: '#4E5D78'
        }
      },
      borderRadius: {
        'xl': '16px'
      },
      boxShadow: {
        'card': '0 8px 16px rgba(0,0,0,0.04), 0 16px 24px rgba(0,0,0,0.06)',
        'btn': '0 4px 12px rgba(0, 98, 245, 0.3)'
      },
      fontFamily: {
        sans: ['Noto Sans SC', 'Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}