module.exports = {
  important: true,
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  // purge: {
  //   enabled: true,
  //   content: ['./src/**/*.html'],
  // },
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      transitionProperty: {
        'spacing': 'margin, padding',
      },
      colors: {
        info: '#3498DB'
      },
      fontSize: {
        'xs': '.65rem'
      },
      margin: {
        '0.3': '0.15rem',
       },
       width:{
        '124': '40rem',
        '148': '48rem',
        '180': '60rem'
       },
       minWidth: {
        '0': '0',
        '1/4': '25%',
        '1/2': '50%',
        '3/4': '75%',
        'full': '100%',
       },
       height:{
        '124': '30rem',
        '148': '34rem',
        '160': '40rem'
       },
       minHeight: {
        '0': '0',
        '1/5':'10vh',
        '1/4': '25vh',
        '1/2': '50vh',
        '3/4': '75vh',
        'full': '100vh',
       },
      fontFamily: {
        // https://tailwindcss.com/docs/font-family#customizing
        sans: [
          'Poppins'
        ],
      },
    },
  },
  variants: {
    extend: {
    },
  },
  plugins: [],
}