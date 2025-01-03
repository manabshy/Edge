import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable, BehaviorSubject, Subject } from "rxjs";
import {
  PropertyAutoComplete,
  PropertyAutoCompleteData,
  Property,
  PropertyData,
  PropertyPhotoData,
  Photo,
  InstructionInfo,
  OfferInfo,
  PropertyNote,
  PropertyLocation,
} from "./property";
import { debounceTime, map, tap } from "rxjs/operators";
import { AppConstants } from "src/app/core/shared/app-constants";
import { CustomQueryEncoderHelper } from "src/app/core/shared/custom-query-encoder-helper";
import { Address } from "src/app/shared/models/address";
import { SharedService } from "src/app/core/services/shared.service";
import { RequestOption, AppUtils } from "src/app/core/shared/utils";
import { Office } from "src/app/shared/models/staff-member";

@Injectable({
  providedIn: "root",
})
export class PropertyService {
  currentPropertyIdSubject = new BehaviorSubject<number | null>(0);
  private propertyPageNumberSubject = new Subject<number>();
  private propertyNoteChangeSubject = new Subject<PropertyNote>();
  private propertyNotePageNumberChangeSubject = new Subject<number>();
  private showPropertyDuplicatesSubject = new Subject<boolean>();
  // private propertyAddedSubject = new Subject<Property | null>();
  private propertyAddedSubject = new BehaviorSubject<Property | null>(null);

  newPropertyAdded$ = this.propertyAddedSubject.asObservable();
  showPropertyDuplicatesChanges$ =
    this.showPropertyDuplicatesSubject.asObservable();
  propertyNoteChanges$ = this.propertyNoteChangeSubject.asObservable();
  propertyNotePageNumberChanges$ =
    this.propertyNotePageNumberChangeSubject.asObservable();
  propertyPageNumberChanges$ = this.propertyPageNumberSubject.asObservable();
  currentPropertyId$ = this.currentPropertyIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  autocompleteProperties(
    opts: RequestOption
  ): Observable<PropertyAutoComplete[]> {
    let options: HttpParams;
    options = AppUtils.setQueryParams(opts);
    const url = `${AppConstants.basePropertyUrl}/autocomplete`;
    return this.http
      .get<PropertyAutoCompleteData>(url, { params: options })
      .pipe(
        debounceTime(300),
        map((response) => response.result),
        tap((data) => console.log(JSON.stringify(data)))
      );
  }

  getPropertySuggestions(
    searchTerm: string,
    searchType?: number
  ): Observable<any[]> {
    const url = `${AppConstants.basePropertyUrl}/suggestions`;
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        searchTerm: searchTerm.toString(),
        searchType: searchType ? searchType.toString() : "",
      },
    });

    return this.http.get<any>(url, { params: options }).pipe(
      map((response) => response.result),
      tap((data) => console.log(JSON.stringify(data)))
    );
  }

  addProperty(property: Property): Observable<Property | any> {
    const url = `${AppConstants.basePropertyUrl}`;
    return this.http.post<PropertyData>(url, property).pipe(
      map((response) => response.result),
      tap((data) =>
        console.log("added property details here...", JSON.stringify(data))
      )
    );
  }

  updateProperty(property: Property): Observable<any> {
    const url = `${AppConstants.basePropertyUrl}/${property.propertyId}`;
    return this.http.put(url, property).pipe(
      map((response) => response),
      tap((data) =>
        console.log("updated property details here...", JSON.stringify(data))
      )
    );
  }

  getProperty(
    propertyId: number,
    includeInfo?: boolean,
    includePhoto?: boolean,
    includeValuers?: boolean,
    includeMap: boolean = false
  ): Observable<Property> {
    if (!includeInfo) {
      includeInfo = false;
    }
    if (!includePhoto) {
      includePhoto = false;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        includeInfo: includeInfo.toString(),
        includePhoto: includePhoto.toString(),
        includeMap: includeMap.toString(),
        includeValuers: includeValuers.toString(),
      },
    });
    const url = `${AppConstants.basePropertyUrl}/${propertyId}`;
    return this.http
      .get<PropertyData>(url, { params: options })
      .pipe(map((response) => response.result));
  }

  getPropertyPhoto(propertyId: number): Observable<Photo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/photos`;
    return this.http
      .get<PropertyPhotoData>(url)
      .pipe(map((response) => response.result));
  }

  getPropertyMap(propertyId: number): Observable<Photo> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/map`;
    return this.http.get<any>(url).pipe(map((response) => response.result));
  }

  getPropertyInstructions(
    propertyId: number,
    isClosedIncluded: boolean
  ): Observable<InstructionInfo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/instructions?activeOnly=${isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map((response) => response.result));
  }

  getPropertyOffers(
    propertyId: number,
    isClosedIncluded: boolean
  ): Observable<OfferInfo[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/offers?activeOnly=${isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map((response) => response.result));
  }
  getValuations(
    propertyId: number,
    isClosedIncluded?: boolean
  ): Observable<any[]> {
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/valuations?activeOnly=${isClosedIncluded}`;
    return this.http.get<any>(url).pipe(map((response) => response.result));
  }
  getPotentialDuplicateProperties(
    address: Address,
    propertyId?: number
  ): Observable<PropertyAutoComplete[]> {
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        addressLine2: address.addressLine2,
        flatNumber: address.flatNumber,
        houseBuildingName: address.houseBuildingName || "",
        houseNumber: address.houseNumber || "",
        inCode: address.inCode || "",
        outCode: address.outCode || "",
        postCode: address.postCode,
        streetName: address.streetName,
        town: address.town,
        propertyId: propertyId ? propertyId.toString() : "",
      },
    });
    const url = `${AppConstants.basePropertyUrl}/duplicates`;
    return this.http
      .get<PropertyAutoCompleteData>(url, { params: options })
      .pipe(
        map((response) => response.result),
        tap((data) => console.log("duplicates", data))
      );
  }

  getPropertyNotes(
    propertyId: number,
    pageSize?: number,
    page?: number
  ): Observable<PropertyNote[]> {
    if (!page) {
      page = 1;
    }
    if (pageSize == null) {
      pageSize = 10;
    }
    const options = new HttpParams({
      encoder: new CustomQueryEncoderHelper(),
      fromObject: {
        pageSize: pageSize.toString(),
        page: page.toString(),
      },
    });
    const url = `${AppConstants.basePropertyUrl}/${propertyId}/notes`;
    return this.http.get<any>(url, { params: options }).pipe(
      map((response) => response.result),
      tap((data) => console.log("property notes here...", JSON.stringify(data)))
    );
  }

  addPropertyNote(propertyNote: PropertyNote): Observable<PropertyNote | any> {
    const url = `${AppConstants.basePropertyUrl}/${propertyNote.propertyId}/notes`;
    return this.http.post<any>(url, propertyNote).pipe(
      map((response) => response.result),
      tap((data) =>
        console.log("added property note here...", JSON.stringify(data))
      )
    );
  }

  updatePropertyNote(
    propertyNote: PropertyNote
  ): Observable<PropertyNote | any> {
    const url = `${AppConstants.basePropertyUrl}/${propertyNote.propertyId}/notes/${propertyNote.id}`;
    return this.http.put<any>(url, propertyNote).pipe(
      map((response) => response.result),
      tap((data) =>
        console.log("updated property note here...", JSON.stringify(data))
      )
    );
  }

  getPropertyOfficeId(address?: Address): Observable<PropertyLocation | any> {
    const url = `${AppConstants.basePropertyUrl}/location`;
    return this.http
      .post<any>(url, address)
      .pipe(map((response) => response.result));
  }

  currentPropertyChanged(propertyId: number) {
    this.currentPropertyIdSubject.next(propertyId);
  }

  propertyNotePageNumberChanged(newPageNumber: number) {
    this.propertyNotePageNumberChangeSubject.next(newPageNumber);
  }

  propertyPageNumberChanged(newPageNumber: number) {
    this.propertyPageNumberSubject.next(newPageNumber);
  }

  propertyNoteChanged(newNote: PropertyNote) {
    this.propertyNoteChangeSubject.next(newNote);
  }

  displayDuplicates(show: boolean) {
    this.showPropertyDuplicatesSubject.next(show);
  }

  setAddedProperty(property: Property) {
    this.propertyAddedSubject.next(property);
  }
}
