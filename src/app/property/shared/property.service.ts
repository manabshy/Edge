import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PropertyAutoComplete, PropertyAutoCompleteData } from './property';
import { map, tap } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  constructor(private http: HttpClient) { }

    AutocompleteProperties(searchTerm: string): Observable<PropertyAutoComplete[] > {
    const url = `${AppConstants.basePropertyUrl}/autocomplete?SearchTerm=${searchTerm}`;
    return this.http.get<PropertyAutoCompleteData>(url)
    .pipe(
         map(response => response.result),
         tap(data => console.log(JSON.stringify(data)))
      );
  }
}
