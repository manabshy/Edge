import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) { }

  findAddress(searchTerm: string, container: string): Observable<AddressAutoCompleteData> {
    const addressRequest = new AddressRequest();
    addressRequest.text = searchTerm;
    addressRequest.container = container;
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded'
    });

    const params = new HttpParams()
                    .set('Key', addressRequest.key  || '')
                    .set('Text', addressRequest.text || '')
                    .set('IsMiddleware', addressRequest.isMiddleware.toString()  || '')
                    .set('Container', addressRequest.container  || '')
                    .set('Origin', addressRequest.origin  || '')
                    .set('Countries', addressRequest.countries  || '')
                    .set('Language', addressRequest.language  || '');
    const options = { headers: headers, params: params };
    return this.http.get<AddressAutoCompleteData>(`${AppConstants.addressCaptureBaseUrl}/Find/v1.10/json3.ws`, options)
    .pipe(
      // map(response => response.items),
      // tap(data => console.log('address here', JSON.stringify(data))),
      // tap(data => console.log('address here', data)),
      );
  }
  getAddress(id: string): Observable<any> {
    const addressRequest = new AddressRequest();
    const headers = new HttpHeaders({
      'Content-type': 'application/x-www-form-urlencoded'
    });
    const params = new HttpParams()
                    .set('Key', addressRequest.key  || '')
                    .set('Id', id  || '');
    const options = { headers: headers, params: params };
    return this.http.get<any>(`${AppConstants.addressCaptureBaseUrl}/Retrieve/v1.10/json3.ws`, options)
    .pipe(
      // map(response => response.items),
      // tap(data => console.log('retrieve address here', data)),
      );
  }
}

export interface AddressAutoCompleteResult {
  Id: string;
  type: string;
  Text: string;
  Highlight: string;
  Description: string;
  Action: string;
  BuildingName: string;
  BuildingNumber: string;
  SubBuilding: string;
  Street: string;
  Line1: string;
  Line2: string;
  Line3: string;
  Line4: string;
  Line5: string;
  Company: string;
  City: string;
  PostalCode: string;
  Type: string;
}

export interface AddressAutoCompleteData {
  Items: AddressAutoCompleteResult[];
}

export class AddressRequest {
    key = AppConstants.addressApiKey;
    text = '';
    isMiddleware = false;
    origin = '';
    countries = 'GBR';
    limit = '10';
    language = 'en-gb';
    container = '';
}
