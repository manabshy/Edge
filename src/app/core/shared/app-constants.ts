import { environment } from 'src/environments/environment';

export class AppConstants {
  public static get addressCaptureBaseUrl(): string { return 'https://services.postcodeanywhere.co.uk/Capture/Interactive'; }
  public static get leaderboardBaseUrl(): string { return `${environment.baseUrl}/staffmembers/leaderboard`; }
  public static get baseUrl(): string { return `${environment.baseUrl}/staffmembers`; }
  public static get baseContactGroupUrl(): string { return `${environment.baseUrl}/contactGroups`; }
  public static get baseCompanyUrl(): string { return `${environment.baseUrl}/companies`; }
  public static get basePersonUrl(): string { return `${environment.baseUrl}/people`; }
  public static get baseInfoUrl(): string { return `${environment.baseUrl}/info`; }
  public static get redirectUri(): string { return `${environment.baseRedirectUri}/auth-callback`; }
  public static get postLogoutRedirectUri(): string { return `${environment.baseRedirectUri}`; }
  public static get tenant(): string { return'ed781348-2f1d-4f1e-bbf8-137da318df39'; }
  public static get clientId(): string { return'03d5d394-2418-42fa-a345-556b8d7ffcdb'; }
  public static get endpointUrl(): string { return `${environment.endpointUrl}` ; }
  public static get addressApiKey(): string { return 'EW85-YA52-FM38-RB26'; }
  public static get postCodePattern(): any {
    return /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]?[\s]+?[0-9][A-Za-z]{2}|[Gg][Ii][Rr][\s]+?0[Aa]{2})$/; }
  public static get emailPattern(): any {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/; }
  public static get telephonePattern(): any { return /^\+?[ \d]+$/g; }
  public static get ukTelephonePattern(): any {
    return /^((\(?0\d{4}\)?\s?\d{3}\s?\d{3})|(\(?0\d{3}\)?\s?\d{3}\s?\d{4})|(\(?0\d{2}\)?\s?\d{4}\s?\d{4}))(\s?\#(\d{4}|\d{3}))?$/;
    // return /^\+?[ \d]+$/g;
    }
  // public static get redirectUri(): string { return 'http://localhost:4200/auth-callback'; }
  // public static get postLogoutRedirectUri(): string { return  'http://localhost:4200'; }
  // public static get leaderboardBaseUrl(): string { return 'http://localhost:57211/v10/staffmembers/leaderboard'; }
  // public static get baseUrl(): string { return'http://localhost:57211/v10/staffMembers'; }
  // public static get baseContactGroupUrl(): string { return'http://localhost:57211/v10/contactGroups'; }
}

export const FormErrors = {
  'companyName': '',
  'searchTerm': '',
  'telephone': '',
  'email': '',
  'fax': ''
};
export const ValidationMessages = {
  'searchTerm': {
    required: ' This field is required.',
  },
  'companyName': {
    required: ' Company name is required.',
  },
  'email': {
    required: ' Email is required.',
    pattern: 'Email is not valid'
  },
  'telephone': {
    required: 'Phone is required.',
    minlength: 'Phone number must be at least 7 characters.',
    maxlength: 'Phone number cannot be more than 16 characters.',
    pattern: 'Phone number is not valid'
  },
  'fax': {
    required: 'Fax is required.',
    minlength: 'Fax number must be at least 7 characters.',
    maxlength: 'Fax number cannot be more than 16 characters.',
    pattern: 'Fax number is not valid'
  }
};
