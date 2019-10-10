import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import {
  PropertyAutoComplete, PropertyAutoCompleteData, Property, PropertyData,
  PropertyPhotoData, Photo, InstructionInfo, OfferInfo, PropertyNote
} from './property';
import { map, tap, switchMap, filter } from 'rxjs/operators';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { CustomQueryEncoderHelper } from 'src/app/core/shared/custom-query-encoder-helper';
import { Address } from 'src/app/core/models/address';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  currentPropertyIdSubject = new BehaviorSubject<number | null>(0);
  private propertyPageNumberSubject = new Subject<number>();
  private propertyNoteChangeSubject = new Subject<PropertyNote>();
  propertNoteChanges$ = this.propertyNoteChangeSubject.asObservable();
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

  getPropertyInstructions(propertyId: number): Observable<InstructionInfo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/instructions`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getPropertyOffers(propertyId: number): Observable<OfferInfo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/offers`;
    return this.http.get<any>(url).pipe(map(response => response.result));
  }

  getPotentialDuplicateProperties(address: Address): Observable<PropertyAutoComplete[]> {
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        addressLine2: address.addressLine2,
        flatNumber: address.flatNumber,
        houseBuildingName: address.houseBuildingName,
        houseNumber: address.houseNumber,
        inCode: address.inCode || '',
        outCode: address.outCode || '',
        postCode: address.postCode,
        streetName: address.streetName,
        town: address.town
      }
    });
    const url = `${AppConstants.basePropertyUrl}/duplicates`;
    return this.http.get<PropertyAutoCompleteData>(url, { params: options })
      .pipe(
        map(response => response.result),
        tap(data => console.log('duplicates', data))
      );
  }

  getPropertyNotes(propertyId: number, pageSize?: number, page?: number): Observable<PropertyNote[]> {
    if (!page || +page === 0) {
      page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper,
      fromObject: {
        pageSize: pageSize.toString(),
        page: page.toString()
      }
    });
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/notes`;
    return this.http.get<any>(url, { params: options }).pipe(
      map(response => response.result),
      tap(data => console.log('property notes here...', JSON.stringify(data)))
    );
  }

  addPropertyNote(propertyNote: PropertyNote): Observable<PropertyNote | any> {
    const url = `${AppConstants.basePropertyUrl}/${propertyNote.propertyId}/notes`;
    return this.http.post<any>(url, propertyNote).pipe(
      map(response => response.result),
      tap(data => console.log('added property note here...', JSON.stringify(data))));
  }

  updatePropertyNote(propertyNote: PropertyNote): Observable<PropertyNote | any> {
    const url = `${AppConstants.basePropertyUrl}/${propertyNote.propertyId}/notes/${propertyNote.id}`;
    return this.http.put<any>(url, propertyNote).pipe(
      map(response => response.result),
      tap(data => console.log('updated property note here...', JSON.stringify(data))));
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

  propertyNoteChanged(newNote: PropertyNote) {
    this.propertyNoteChangeSubject.next(newNote);
  }

}

