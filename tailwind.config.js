const { fontFamily } = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './layouts/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false,
  variants: {
    margin: ['responsive', 'last'],
  },
  theme: {
    extend: {
      colors: {
        'spotify-gray': 'rgb(24, 24, 24)',
        'spotify-green': '#1db954',
        'spotify-light-green': 'rgb(30, 215, 96)',
        'lyrics': {
          50: '#F4FAF9',
          100: '#EAF5F4',
          200: '#CAE7E3',
          300: '#AAD8D2',
          400: '#6ABAB1',
          500: '#2A9D8F',
          600: '#268D81',
          700: '#195E56',
          800: '#134740',
          900: '#0D2F2B',
        },
      },
      borderColor: {
        'spotify-green': '#1db954',
      },
      height: {
        thumbnail: '3.125rem',
      },
      width: {
        thumbnail: '3.125rem',
      },
      fontFamily: {
        sans: ['Circular Std', ...fontFamily.sans],
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
