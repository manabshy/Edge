 import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { PropertyAutoComplete, PropertyAutoCompleteData, Property, PropertyData } from './property';
import { map, tap, switchMap, filter, first } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

currentPropertyIdSubject = new BehaviorSubject<number | null>(0);
currentPropertyId$ = this.currentPropertyIdSubject.asObservable();
currentPropertyChanged(propertyId: number) {
  this.currentPropertyIdSubject.next(propertyId);
}

  constructor(private http: HttpClient) { }

  autocompleteProperties(property: any): Observable<PropertyAutoComplete[]> {
    const options = new HttpParams()
      .set('searchTerm', property.propertyAddress || '');
    const url = `${AppConstants.basePropertyUrl}/autocomplete`;
    return this.http.get<PropertyAutoCompleteData>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
  }
  getProperty(propertyId: number): Observable<Property> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}`;
    return this.http.get<PropertyData>(url).pipe(map(response => response.result));
  }

  addProperty(property: Property): Observable<Property | any> {
    const url = `${AppConstants.basePropertyUrl}`;
    return this.http.post<PropertyData>(url, property).pipe(
      map(response => response.result),
      tap(data => console.log('added property details here...', JSON.stringify(data))));
  }

  updateProperty(property: Property): Observable<any> {
    const url = `${AppConstants.basePropertyUrl}/${property.propertyId}`;
    return this.http.put(url, property).pipe(
      map(response => response),
      tap(data => console.log('updated property details here...', JSON.stringify(data))));
  }
  // tslint:disable-next-line:member-ordering
  propertyDetails$ = this.currentPropertyId$
    .pipe(
      filter(propertyId => Boolean(propertyId)),
      switchMap(propertyId => this.http.get<PropertyData>(`${AppConstants.basePropertyUrl}/${propertyId}?includeInfo=true&includePhoto=true`)
        .pipe(
          map(response => response.result),
          tap(data => console.log('details returned', JSON.stringify(data)))
        )
      ));
  // dataForProperty$ =  this.currentPropertyId$
  // .pipe(
  //   filter(propertyId => Boolean(propertyId)),
  //   switchMap(propertyId => this.http.get<PropertyData>(`${AppConstants.basePropertyUrl}/${propertyId}`)
  //   .pipe(
  //     map(properties => properties.result[0]),
  //     switchMap(property =>
  //       combineLatest([
  //         this.http.get<PropertyData>(`${AppConstants.basePropertyUrl}/${propertyId}/1`),
  //         this.http.get<PropertyData>(`${AppConstants.basePropertyUrl}/${propertyId}/2`)
  //       ])
  //       .pipe(
  //       //   map(([properties, photos]) =>{
  //       //     propertyAddress: property.propertyAddress
  //       //     photos: photos
  //       //   })
  //       //  as PropData)
  //       tap(data => console.log(data))
  //       )
  //   )
  //   )
  // )); // fix this
}

