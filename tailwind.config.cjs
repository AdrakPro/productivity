/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/renderer/**/*.{html,js,svelte}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#BB86FC',
          variant: '#3700B3',
          hover: '#D4A5FF',
        },
        secondary: {
          DEFAULT: '#03DAC6',
          hover: '#04F5DD',
        },
        background: '#121212',
        surface: {
          DEFAULT: '#121212',
          light: '#1E1E1E',
          lighter: '#2D2D2D',
        },
        error: {
          DEFAULT: '#CF6679',
          hover: '#E57788',
        },
        'on-primary': '#000000',
        'on-secondary': '#000000',
        'on-background': '#FFFFFF',
        'on-surface': '#FFFFFF',
        'on-error': '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
