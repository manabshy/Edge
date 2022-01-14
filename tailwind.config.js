const colors = require('tailwindcss/colors')

module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      colors: {
        info: '#3498DB',
        primary: '#4DA685',
        secondary: '#0a1a4a',
        'ocean-green': {
          DEFAULT: '#4DA685',
          50: '#C6E5D9',
          100: '#B8DED0',
          200: '#9CD1BE',
          300: '#80C4AB',
          400: '#64B799',
          500: '#4DA685',
          600: '#3B8066',
          700: '#295948',
          800: '#183329',
          900: '#060D0A'
        },
        downriver: {
          DEFAULT: '#0A1A4A',
          50: '#2958E2',
          100: '#1D4DDA',
          200: '#1940B6',
          300: '#143392',
          400: '#0F276E',
          500: '#0A1A4A',
          600: '#030919',
          700: '#000000',
          800: '#000000',
          900: '#000000'
        },
        transparent: 'transparent',
        current: 'currentColor',
        black: colors.black,
        white: colors.white,
        gray: colors.gray,
        emerald: colors.emerald,
        indigo: colors.indigo,
        yellow: colors.yellow,
        red: colors.red
      },
      backgroundColor: ['even'],
      transitionProperty: {
        spacing: 'margin, padding'
      },
      fontSize: {
        xs: '.65rem'
      },
      margin: {
        0.3: '0.15rem'
      },
      width: {
        124: '40rem',
        148: '48rem',
        180: '60rem'
      },
      minWidth: {
        0: '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        full: '100%'
      },
      height: {
        124: '30rem',
        148: '34rem',
        160: '40rem'
      },
      minHeight: {
        0: '0',
        '1/5': '10vh',
        '1/4': '25vh',
        '1/2': '50vh',
        '3/4': '75vh',
        full: '100vh'
      },
      fontFamily: {
        // https://tailwindcss.com/docs/font-family#customizing
        sans: ['Poppins']
      }
    }
  },
  corePlugins: {
    preflight: false
  },
  plugins: []
}
