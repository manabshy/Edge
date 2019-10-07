import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject, combineLatest } from 'rxjs';
import { PropertyAutoComplete, PropertyAutoCompleteData, Property, PropertyData, PropertyPhotoData, Photo } from './property';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';
import { Address } from 'src/app/core/models/address';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {

  currentPropertyIdSubject = new BehaviorSubject<number | null>(0);
  private  propertyPageNumberSubject = new Subject<number>();
  private searchTermSubject = new BehaviorSubject('');
  private pageSubject = new BehaviorSubject(0);
  private pageSizeSubject = new BehaviorSubject(0);
  searchTerm$ = this.searchTermSubject.asObservable();
  page$ = this.pageSubject.asObservable();
  pageSize$ = this.pageSizeSubject.asObservable();
  propertyPageNumberChanges$ = this.propertyPageNumberSubject.asObservable();
  currentPropertyId$ = this.currentPropertyIdSubject.asObservable();

  constructor(private http: HttpClient) { }

  autocompleteProperties(searchTerm: any, pageSize?: number, page?: number): Observable<PropertyAutoComplete[]> {
    if (!page || +page === 0) {
      page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        searchTerm: searchTerm,
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    });
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
    return this.http.get<PropertyData>(url, { params: options }).pipe(map(response => response.result));
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

  getPotentialDuplicateProperties(address: Address): Observable<PropertyAutoComplete[]> {
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        streetName: address.streetName,
        postCode: address.postCode
      }
    });
    const url = `${AppConstants.basePropertyUrl}/duplicates`;
    return this.http.get<PropertyAutoCompleteData>(url, { params: options }).pipe(map(response => response.result));
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

  currentPropertyChanged(propertyId: number) {
    this.currentPropertyIdSubject.next(propertyId);
  }

  propertyPageNumberChanged(newPageNumber: number) {
    this.propertyPageNumberSubject.next(newPageNumber);
  }

  // combinedParameters = combineLatest([this.searchTerm$, this.pageSize$, this.page$]);
  // autocompleteProperties$ = this.combinedParameters.pipe(
  //   switchMap(([searchTerm, pageSize, page]) => {
  //     const options = new HttpParams({
  //       encoder: new CustomQueryEncoderHelper,
  //       fromObject: {
  //         searchTerm: searchTerm.toString(),
  //         pageSize: pageSize.toString(),
  //         page: page.toString()
  //       }
  //     });
  //     const url = `${AppConstants.basePropertyUrl}/autocomplete`;
  //     return this.http.get<PropertyAutoCompleteData>(url, { params: options });
  //   }),
  //   map(response => response.result),
  //   tap(data => console.log(JSON.stringify(data)))
  // );
}

