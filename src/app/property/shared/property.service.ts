import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyAutoComplete, PropertyAutoCompleteData, Property, PropertyData } from './property';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
currentProperty: PropertyAutoComplete | null;

  constructor(private http: HttpClient) { }

    autocompleteProperties(property: any): Observable<PropertyAutoComplete[] > {
    const  options = new HttpParams()
      .set('searchTerm', property.propertyAddress  || '') ;
    const url = `${AppConstants.basePropertyUrl}/autocomplete`;
    return this.http.get<PropertyAutoCompleteData>(url, {params: options})
    .pipe(
         map(response => response.result),
         tap(data => console.log(JSON.stringify(data)))
      );
  }
  getProperty(propertyId: number): Observable<Property> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}`;
    return this.http.get<PropertyData>(url).pipe(map(response => response.result));
  }
}
