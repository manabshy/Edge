const colors = require('tailwindcss/colors')

module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx,html}'],
  theme: {
    extend: {
      backgroundColor: ['even'],
      transitionProperty: {
        spacing: 'margin, padding'
      },
      colors: {
        info: '#3498DB',
        primary: '#285a48',
        secondary: '#0a1a4a',
        plantation: {
            DEFAULT: '#285A48',
            50: '#77C3A7',
            100: '#69BC9E',
            200: '#4EAF8C',
            300: '#419275',
            400: '#35765F',
            500: '#285A48',
            600: '#173329',
            700: '#050C0A',
            800: '#000000',
            900: '#000000'
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
        }
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
