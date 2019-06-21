// This file can be replaced during build by using the `fileReplacements` array.
// `ng build ---prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  baseUrl: 'https://dandg-api-wedge-dev.azurewebsites.net/v10',
  baseRedirectUri: 'http://localhost:4200',
  // endpointUrl: ' \'https://dandg-api-wedge-dev.azurewebsites.net\': \'67f9a9a1-d8de-45bc-af20-43e1e18ccba5\''
  endpointUrl: 'https://dandg-api-wedge-dev.azurewebsites.net'
};

/*
 * In development mode, to ignore zone related error stack frames such as
 * `zone.run`, `zoneDelegate.invokeTask` for easier debugging, you can
 * import the following file, but please comment it out in production mode
 * because it will have performance impact when throw error
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
