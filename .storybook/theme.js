// .storybook/YourTheme.js

import { create } from '@storybook/theming';

export default create({
  base: 'light',
  appBg: '#0a1a4a',
  brandTitle: 'Douglas & Gordon storybook',
  brandUrl: 'https://example.com',
  brandImage: '/assets/dng_logo.png',
  // textColor: 'white',
  // textInverseColor: 'rgba(55,55,55,0.9)',
  base: 'light',

  colorPrimary: '#0a1a4a',
  colorSecondary: '#4da685',

  // UI
  // appBg: 'white',
  appContentBg: 'silver',
  appBorderColor: 'grey',
  appBorderRadius: 4,

  // Typography
  fontBase: '"Open Sans", sans-serif',
  fontCode: 'monospace',

  // Text colors
  textColor: '#fafafa',
  textInverseColor: 'rgba(255,255,255,0.9)',

  // Toolbar default and active colors
  barTextColor: 'silver',
  barSelectedColor: 'black',
  barBg: '#4da685',

  // Form colors
  inputBg: 'white',
  inputBorder: 'silver',
  inputTextColor: 'black',
  inputBorderRadius: 4,
});