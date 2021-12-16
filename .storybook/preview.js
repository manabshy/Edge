import { setCompodocJson } from '@storybook/addon-docs/angular'
import { initialize, mswDecorator } from 'msw-storybook-addon'
// import docJson from "../documentation.json";
// setCompodocJson(docJson);
import 'tailwindcss/tailwind.css'
export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/
    }
  },
  docs: { inlineStories: true }
}

// Initialize MSW
initialize()

// Provide the MSW addon decorator globally
export const decorators = [mswDecorator]
