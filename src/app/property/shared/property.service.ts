 import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, combineLatest, Subject } from 'rxjs';
import { PropertyAutoComplete, PropertyAutoCompleteData, Property, PropertyData, PropertyPhotoData, Photo } from './property';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

currentPropertyIdSubject = new BehaviorSubject<number | null>(0);
// currentPropertyIdSubject = new Subject<number | null>();
currentPropertyId$ = this.currentPropertyIdSubject.asObservable();
currentPropertyChanged(propertyId: number) {
  this.currentPropertyIdSubject.next(propertyId);
}

  constructor(private http: HttpClient) { }

  autocompleteProperties(property: any, pageSize?: number): Observable<PropertyAutoComplete[]> {
    pageSize = 100;
    const options = new HttpParams()
      .set('searchTerm', property.propertyAddress || '')
      .set('pageSize', pageSize.toString());
    const url = `${AppConstants.basePropertyUrl}/autocomplete`;
    return this.http.get<PropertyAutoCompleteData>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log(JSON.stringify(data)))
      );
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
  getProperty(propertyId: number, includeInfo?: boolean, includePhoto?: boolean): Observable<Property> {
    if (!includeInfo) {
      includeInfo = false;
    }
    if (!includePhoto) {
      includePhoto = false;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        includeInfo: includeInfo.toString(),
        includePhoto: includePhoto.toString(),
      }
    });
    const url = `${AppConstants.basePropertyUrl}/${propertyId}`;
    return this.http.get<PropertyData>(url, {params: options}).pipe(map(response => response.result));
  }

  getPropertyPhoto(propertyId: number): Observable<Photo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/photos`;
    return this.http.get<PropertyPhotoData>(url).pipe(map(response => response.result));
  }
  // TODO: temp
  getPropertyMap(propertyId: number): Observable<Photo> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/map`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  propertyDetails$ = this.currentPropertyId$
    .pipe(
      filter(propertyId => Boolean(propertyId)),
      switchMap(propertyId => this.http.get<PropertyData>(`${AppConstants.basePropertyUrl}/${propertyId}?includeInfo=true&includePhoto=true`)
        .pipe(
          map(response => response.result),
          tap(data => console.log('property id of details returned', propertyId)),
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

