import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';

export class AppConstants {
  public static get addressCaptureBaseUrl(): string { return 'https://services.postcodeanywhere.co.uk/Capture/Interactive'; }
  public static get leaderboardBaseUrl(): string { return `${environment.baseUrl}/staffmembers/leaderboard`; }
  public static get baseUrl(): string { return `${environment.baseUrl}/staffmembers`; }
  public static get baseValuationUrl(): string { return `${environment.baseUrl}/valuations`; }
  public static get basePropertyUrl(): string { return `${environment.baseUrl}/properties`; }
  public static get baseDiaryEventUrl(): string { return `${environment.baseUrl}/diaryEvents`; }
  public static get baseContactGroupUrl(): string { return `${environment.baseUrl}/contactGroups`; }
  public static get baseCompanyUrl(): string { return `${environment.baseUrl}/companies`; }
  public static get basePersonUrl(): string { return `${environment.baseUrl}/people`; }
  public static get baseInfoUrl(): string { return `${environment.baseUrl}/info`; }
  public static get baseTapiUrl(): string { return `${environment.baseUrl}/tapi`; }
  public static get baseSmsUrl(): string { return `${environment.baseUrl}/sms`; }
  public static get redirectUri(): string { return `${environment.baseRedirectUri}/auth-callback`; }
  public static get postLogoutRedirectUri(): string { return `${environment.baseRedirectUri}`; }
  public static get tenant(): string { return 'ed781348-2f1d-4f1e-bbf8-137da318df39'; }
  public static get clientId(): string { return '03d5d394-2418-42fa-a345-556b8d7ffcdb'; }
  public static get endpointUrl(): string { return `${environment.endpointUrl}`; }
  public static get addressApiKey(): string { return 'EW85-YA52-FM38-RB26'; }
  public static get googleApiKey(): string { return 'AIzaSyC1Hv_vNkUxvvRibyjPbfgNhrTNi30jNtQ'; }
  public static get baseLeadsUrl(): string { return `${environment.baseUrl}/leads`; }
  public static get baseOfficeUrl(): string { return `${environment.baseUrl}/offices`; }
  public static get postCodePattern(): any {
    return /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]?[\s]+?[0-9][A-Za-z]{2}|[Gg][Ii][Rr][\s]+?0[Aa]{2})$/;
  }
  public static get emailPattern(): any {
    return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  }
  public static get telephonePattern(): any { return /\+?[ \d]+$/g; }
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
  'fax': '',
  'titleId': '',
  'firstName': '',
  'lastName': '',
  'middleName': '',
  'emailAddresses': {
    'email': '',
  },
  'fullAddress': '',
  'address': '',
  'number': '',
  'postCode': '',
  'senderPhoneNumber': '',
  'senderName': '',
  'message': '',
  'phoneNumber': '',
  'propertyTypeId': '',
  'propertyStyleId': '',
  'regionId': '',
  'areaId': '',
  'subAreaId': '',
  'leadTypeId': '',
  'nextChaseDate': '',
  'reason': '',
  'timeFrame': '',
  'marketChat': '',
  'generalNotes': '',
};
export const ValidationMessages = {
  'searchTerm': {
    required: ' This field is required',
  },
  'companyName': {
    required: ' Company name is required',
  },
  'email': {
    required: ' Email is required',
    pattern: 'Email is not valid'
  },
  'telephone': {
    international: 'Not UK number, please enter the international prefix',
    invalidPhoneNumber: 'Please enter a valid phone number'
  },
  'fax': {
    invalidPhoneNumber: 'Fax number is not valid'
  },
  'titleId': {
    required: 'Title is required'
  },
  'firstName': {
    required: 'First Name is required',
    minlength: 'First Name must be greater than 2 characters',
    maxlength: 'First Name must be less than 40 characters',
  },
  'middleName': {
    maxlength: 'Middle Name must be less than 50 characters'
  },
  'lastName': {
    required: 'Last name is required',
    minlength: 'Last name must be greater than 2 characters',
    maxlength: 'Last name must be less than 80 characters',
  },
  'emailAddress': {
    'email': {
      required: ' Email is required',
      pattern: 'Email is not valid'
    },
  },
  'address': {
    required: 'Address is required'
  },
  'fullAddress': {
    required: 'Address is required'
  },
  'number': {
    required: 'Phone is required',
    minlength: 'Phone number must be at least 7 characters',
    maxlength: 'Phone number cannot be more than 16 characters',
    pattern: 'Phone number is not valid',
    invalidMobileType: `Telephone number is not a valid mobile number`
  },
  'postCode': {
    required: 'Postcode is required',
    minlength: 'Postcode must be at least 5 characters',
    maxlength: 'Postcode cannot be more than 7 characters',
    pattern: 'Postcode is not valid'
  },
  'senderPhoneNumber': {
    international: 'Not UK number, please enter the international prefix',
    required: 'Sender phone number is required',
    invalidPhoneNumber: 'Please enter a valid phone number'
  },
  'senderName': {
    required: 'Sender name is required'
  },
  'message': {
    required: 'Message is required'
  },
  'warningStatusComment': {
    maxlength: 'Comment cannot be more than 20 characters',
  },
  'propertyTypeId': {
    required: 'Property Type is required'
  },
  'propertyStyleId': {
    required: 'Property Style is required'
  },
  'regionId': {
    required: 'Region is required'
  },
  'areaId': {
    required: 'Area is required'
  },
  'subAreaId': {
    required: 'Sub Area is required'
  },
  'leadTypeId': {
    required: 'Lead Type is required'
  },
  'nextChaseDate': {
    required: 'Next chase date is required',
    nextChaseDatePassed: 'Next chase date cannot be in the past'
  },
  'reason': {
    required: 'Reason is required'
  },
  'timeFrame': {
    required: 'Time frame is required'
  },
  'marketChat': {
    required: 'Market chat is required'
  },
  'generalNotes': {
    required: 'Property note is required'
  }
  // 'invalidPhoneNumber': {
  //   required: 'Phone is required',
  //   minlength: 'Phone number must be at least 7 characters',
  //   maxlength: 'Phone number cannot be more than 16 characters',
  //   pattern: 'Phone number is not valid'
  // }
};

