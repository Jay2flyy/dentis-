/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dental: {
          primary: '#0ea5e9',
          secondary: '#06b6d4',
          accent: '#14b8a6',
          dark: '#0c4a6e',
          light: '#e0f2fe',
        },
        template: {
          blue: '#6B9BD1',
          purple: '#B794F6',
          green: '#7FD99A',
          dark: '#1E293B',
        }
      },
      fontFamily: {
        sans: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Roboto', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Bebas Neue', 'Anton', 'Impact', 'sans-serif'],
        display: ['Anton', 'Impact', 'sans-serif'],
      },
      animation: {
        'slide-up': 'slideUp 0.5s ease-out',
        'fade-in': 'fadeIn 0.3s ease-in',
      },
      keyframes: {
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
