export class AppConstants {
  public static get leaderboardBaseUrl(): string { return 'https://dandg-api-wedge.azurewebsites.net/v10/staffmembers/leaderboard'; }
  public static get baseUrl(): string { return'https://dandg-api-wedge.azurewebsites.net/v10/staffmembers'; }
  public static get tenant(): string { return'ed781348-2f1d-4f1e-bbf8-137da318df39'; }
  public static get clientId(): string { return'03d5d394-2418-42fa-a345-556b8d7ffcdb'; }
  public static get redirectUri(): string { return 'https://stagedouglasandgordon-wedge.azurewebsites.net/auth-callback'; }
  public static get postLogoutRedirectUri(): string { return 'https://stagedouglasandgordon-wedge.azurewebsites.net'; }
  public static get endpointUrl(): string { return 'https://dandg-api-wedge.azurewebsites.net'; }
//  public static get leaderboardBaseUrl(): string { return 'http://localhost:57211/v10/staffmembers/leaderboard'; }
//   public static get baseUrl(): string { return'http://localhost:57211/v10/staffmembers'; }

}
