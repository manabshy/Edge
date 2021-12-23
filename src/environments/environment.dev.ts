const { version: appVersion } = require('../../package.json')
export const environment = {
  version: appVersion,
  production: false,
  hmr: true,
  clientId: '03d5d394-2418-42fa-a345-556b8d7ffcdb',
  authority: 'https://login.microsoftonline.com/ed781348-2f1d-4f1e-bbf8-137da318df39',
  baseRedirectUri: 'http://localhost:4200',
  baseUrl: 'https://dandg-api-wedge-dev.azurewebsites.net/v10',
  endpointUrl: 'https://dandg-api-wedge-dev.azurewebsites.net'
}
