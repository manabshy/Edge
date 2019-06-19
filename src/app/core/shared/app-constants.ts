export class AppConstants {
  public static get addressCaptureBaseUrl(): string { return 'https://services.postcodeanywhere.co.uk/Capture/Interactive'; }
  public static get leaderboardBaseUrl(): string { return 'https://dandg-api-wedge-test.azurewebsites.net/v10/staffmembers/leaderboard'; }
  public static get baseUrl(): string { return'https://dandg-api-wedge-test.azurewebsites.net/v10/staffmembers'; }
  public static get  baseContactGroupUrl(): string { return'https://dandg-api-wedge-test.azurewebsites.net/v10/contactGroups'; }
  public static get  baseCompanyUrl(): string { return'https://dandg-api-wedge-test.azurewebsites.net/v10/companies'; }
  public static get  basePersonUrl(): string { return'https://dandg-api-wedge-test.azurewebsites.net/v10/people'; }
  public static get  baseInfoUrl(): string { return'https://dandg-api-wedge-test.azurewebsites.net/v10/info'; }
  public static get tenant(): string { return'ed781348-2f1d-4f1e-bbf8-137da318df39'; }
  public static get clientId(): string { return'03d5d394-2418-42fa-a345-556b8d7ffcdb'; }
  public static get redirectUri(): string { return 'https://dandg-edge-test.azurewebsites.net/auth-callback'; }
  public static get postLogoutRedirectUri(): string { return 'https://dandg-edge-test.azurewebsites.net'; }
  // public static get azureEndpointUrl(): string { return 'https://dandg-api-wedge.azurewebsites.net'; }
  public static get addressApiKey(): string { return 'EW85-YA52-FM38-RB26'; }
  public static get postCodePattern(): any {
    return /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]?[\s]+?[0-9][A-Za-z]{2}|[Gg][Ii][Rr][\s]+?0[Aa]{2})$/; }
  public static get emailPattern(): any {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; }
  public static get telephonePattern(): any { return /^\+?[ \d]+$/g; }
  // public static get redirectUri(): string { return 'http://localhost:4200/auth-callback'; }
  // public static get postLogoutRedirectUri(): string { return  'http://localhost:4200'; }
   public static get localEndpointUrl(): string { return '\'http://localhost:57211\': \'67f9a9a1-d8de-45bc-af20-43e1e18ccba5\''; }
  // public static get leaderboardBaseUrl(): string { return 'http://localhost:57211/v10/staffmembers/leaderboard'; }
  // public static get baseUrl(): string { return'http://localhost:57211/v10/staffMembers'; }
  // public static get baseContactGroupUrl(): string { return'http://localhost:57211/v10/contactGroups'; }
}
