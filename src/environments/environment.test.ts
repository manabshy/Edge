import { version } from '../../package.json'

export const environment = {
  version,
  production: true,
  hmr: false,
  baseUrl: 'https://dandg-api-wedge-test.azurewebsites.net/v10',
  baseRedirectUri: 'https://dandg-edge-test.azurewebsites.net',
  endpointUrl: 'https://dandg-api-wedge-test.azurewebsites.net'
};
