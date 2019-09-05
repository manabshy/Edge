 import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { PropertyAutoComplete, PropertyAutoCompleteData, Property, PropertyData, PropertyPhotoData, Photo, PropertyWithPhotos } from './property';
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

  getPropertyPhoto(propertyId: number): Observable<Photo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/photos`;
    return this.http.get<PropertyPhotoData>(url).pipe(map(response => response.result));
  }

  propertyDetails$ = this.currentPropertyId$
    .pipe(
      filter(propertyId => Boolean(propertyId)),
      switchMap(propertyId => this.http.get<PropertyData>(`${AppConstants.basePropertyUrl}/${propertyId}?includeInfo=true&includePhoto=true`)
        .pipe(
          map(response => response.result),
          tap(data => console.log('details returned', JSON.stringify(data)))
        )
      ));

  // propertyPhotos$ = this.currentPropertyId$
  // .pipe(
  //   filter(propertyId => Boolean(propertyId)),
  //   switchMap(propertyId => this.http.get<PropertyPhotoData>(`${AppConstants.basePropertyUrl}/${propertyId}/photos`)
  //     .pipe(
  //       map(response => response.result),
  //       tap(data => console.log('photos returned', JSON.stringify(data)))
  //     )
  //   ));

  //   propertyDetailsWithPhotos$ = combineLatest(this.propertyDetails$, this.propertyPhotos$)
  //   .pipe(map(([detail, photos]) => ({
  //     propertyDetails: detail,
  //     photos: photos
  //   })));
}

