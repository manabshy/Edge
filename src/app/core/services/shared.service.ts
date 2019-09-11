import { Injectable } from '@angular/core';
import { AppUtils } from '../shared/utils';
import * as dayjs from 'dayjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, Subject, of } from 'rxjs';
import { AppConstants} from '../shared/app-constants';
import { map, fill } from 'lodash';
import { tap, publishReplay, refCount, take, shareReplay} from 'rxjs/operators';
import { BsModalService } from 'ngx-bootstrap/modal/';
import { ErrorModalComponent } from '../error-modal/error-modal.component';
import { NoteModalComponent } from '../note-modal/note-modal.component';
import { PhoneNumberUtil } from 'google-libphonenumber';
import { Location } from '@angular/common';
import { Title } from '@angular/platform-browser';


@Injectable({
  providedIn: 'root'
})
export class SharedService {
  infoDetail: DropdownListInfo;
  lastCallNoteToast: any;
  formErrors: any;

  // private infoDetail: DropdownListInfo;
  // get dropdownListInfo() {
  //   this.getDropdownListInfo().subscribe(data =>{
  //     this.infoDetail = data;
  //     console.log('data from getter', this.infoDetail)
  //   });
  //   return this.infoDetail;
  // // }
  // get dropdownListInfo() {
  //   const listInfo = localStorage.getItem('dropdownListInfo');
  //   return JSON.parse(listInfo);
  // }
  constructor(private http: HttpClient,
              private _location: Location,
              private titleService: Title,
              private modalService: BsModalService) {

  }

  back() {
    if (!(window.opener && window.opener !== window)) {
      this._location.back();
    } else {
      window.close();
    }
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  openLinkWindow(link: string) {
    const width = Math.floor(Math.random() * 100) + 860;
    const height = Math.floor(Math.random() * 100) + 500;
    const left = window.top.outerWidth / 2 + window.top.screenX - ( 960 / 2);
    const top = window.top.outerHeight / 2 + window.top.screenY - ( 600 / 2);
    const w = window.open(link, '_self');
    AppUtils.openedWindows.push(w);
    setTimeout(()=>{
      AppUtils.openedWindows.forEach(x=>{
        x.focus();
      })
    })
  }

  showWarning(id:number, warnings: any, comment?: string):any {
    let warns = [];
    if(warnings) {
      warns = warnings.filter(x => x.id === id)
    }
    return warns[0];
  }

  showError(error: WedgeError) {
    const subject = new Subject<boolean>();
        const initialState = {
          title: error.requestId,
          desc: error.displayMessage,
          techDet: error.technicalDetails
        };
        const modal = this.modalService.show(ErrorModalComponent, {ignoreBackdropClick: true, initialState});
        modal.content.subject = subject;
        return subject.asObservable();
  }

  addNote(data: any) {
    const subject = new Subject<boolean>();
        const initialState = {
          data: data
        };
        const modalClass = 'modal-lg';
        const modal = this.modalService.show(NoteModalComponent, {class: modalClass, initialState});
        modal.content.subject = subject;
        return subject.asObservable();
  }

  scrollTodayIntoView() {
    setTimeout(() => {
      if (window.innerWidth < 576) {
        if (document.getElementById('today')) {
          document.getElementById('today').scrollIntoView({block: 'center'});
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
  }

  scrollCurrentHourIntoView() {
    setTimeout(() => {
      const currentHour = dayjs().hour();
      const currentHourDivs = document.getElementsByClassName('hour-' + currentHour);
      if (currentHourDivs) {
        for (let i = 0; i < currentHourDivs.length; i++) {
          currentHourDivs[i].scrollIntoView({block: 'center'});
        }
      }
    });
  }

  objectToMap(o) {
    let m = new Map()
    for(let k of Object.keys(o)) {
        if(o[k] instanceof Object) {
            m.set(k, this.objectToMap(o[k]))
        }
        else {
            m.set(k, o[k])
        }
    }
      return m
  }

  ISOToDate(date: Date): Date {
    let formattedDate = null;
    if (date) {
      formattedDate = dayjs(date).toDate();
    }
    return formattedDate;
  }

  formatPostCode(postCodeToCheck: string) {
    // Permitted letters depend upon their position in the postcode.
    const alpha1 = '[abcdefghijklmnoprstuwyz]';                       // Character 1
    const alpha2 = '[abcdefghklmnopqrstuvwxy]';                       // Character 2
    const alpha3 = '[abcdefghjkpmnrstuvwxy]';                         // Character 3
    const alpha4 = '[abehmnprvwxy]';                                  // Character 4
    const alpha5 = '[abdefghjlnpqrstuwxyz]';                          // Character 5
    const BFPOa5 = '[abdefghjlnpqrst]';                               // BFPO alpha5
    const BFPOa6 = '[abdefghjlnpqrstuwzyz]';                          // BFPO alpha6

    // Array holds the regular expressions for the valid postcodes
    const pcexp = new Array();

    // BFPO postcodes
    pcexp.push(new RegExp('^(bf1)(\\s*)([0-6]{1}' + BFPOa5 + '{1}' + BFPOa6 + '{1})$', 'i'));

    // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
    pcexp.push(new RegExp('^(' + alpha1 + '{1}' + alpha2 + '?[0-9]{1,2})(\\s*)([0-9]{1}' + alpha5 + '{2})$', 'i'));

    // Expression for postcodes: ANA NAA
    pcexp.push(new RegExp('^(' + alpha1 + '{1}[0-9]{1}' + alpha3 + '{1})(\\s*)([0-9]{1}' + alpha5 + '{2})$', 'i'));

    // Expression for postcodes: AANA  NAA
    pcexp.push(new RegExp('^(' + alpha1 + '{1}' + alpha2 + '{1}' + '?[0-9]{1}' + alpha4 + '{1})(\\s*)([0-9]{1}' + alpha5 + '{2})$', 'i'));

    // Exception for the special postcode GIR 0AA
    pcexp.push(/^(GIR)(\s*)(0AA)$/i);

    // Standard BFPO numbers
    pcexp.push(/^(bfpo)(\s*)([0-9]{1,4})$/i);

    // c/o BFPO numbers
    pcexp.push(/^(bfpo)(\s*)(c\/o\s*[0-9]{1,3})$/i);

    // Overseas Territories
    pcexp.push(/^([A-Z]{4})(\s*)(1ZZ)$/i);

    // Anguilla
    pcexp.push(/^(ai-2640)$/i);

    // Load up the string to check
    let postCode = postCodeToCheck;

    // Assume we're not going to find a valid postcode
    let valid = false;

    // Check the string against the types of post codes
    for (let i = 0; i < pcexp.length; i++) {

      if (pcexp[i].test(postCode) && postCode) {
        postCode.trim();
        // The post code is valid - split the post code into component parts
        pcexp[i].exec(postCode);

        // Copy it back into the original string, converting it to uppercase and inserting a space
        // between the inward and outward codes
        postCode = RegExp.$1.toUpperCase() + ' ' + RegExp.$3.toUpperCase();

        // If it is a BFPO c/o type postcode, tidy up the "c/o" part
        postCode = postCode.replace(/C\/O\s*/, 'c/o ');

        // If it is the Anguilla overseas territory postcode, we need to treat it specially
        if (postCodeToCheck.toUpperCase() === 'AI-2640') { postCode = 'AI-2640'; }

        // Load new postcode back into the form element
        valid = true;

        // Remember that we have found that the code is valid and break from loop
        break;
      }
    }
    // Return with either the reformatted valid postcode or the original invalid postcode
    if (valid) { return postCode; } else { return postCodeToCheck; }
  }

  splitPostCode(postcode: string) {
    const postCodeParts: string[] = [];
    let outCode: string;
    let inCode: string;
    if (postcode) {
     outCode = postcode.split(' ')[0];
     inCode = postcode.split(' ')[1];
     postCodeParts.push(outCode);
     postCodeParts.push(inCode);
    }
    return postCodeParts;
  }
  /**
   * Generate an array of exponential values for letting prices
   *
   * @returns {number[]}
   */
  public priceRangeLet(): number[] {
    let pv = 0;
    return map(fill((new Array(30)), 0), (v, i) => {
      v = pv;
      if (v < 1000) { v += 50; } else if (v >= 1000 && v < 2000) { v += 250; } else if (v >= 2000 && v < 5000) { v += 500; }
      pv = v;
      return pv;
    });
  }

  /**
   * Generate an array of exponential values for sale prices
   *
   * @returns {number[]}
   */
  public priceRangeSale(): number[] {
    let pv = 0;
    return map(fill((new Array(30)), 0), (vv, i) => {
      vv = pv;
      if (vv < 1000000) { vv += 50000; } else if (vv >= 1000000 && vv < 2000000) { vv += 250000; } else if (vv >= 2000000 && vv < 5000000) { vv += 500000; }
      pv = vv;
      return pv;
    });
  }

  isUKMobile(number: string) {
    if (number) {
      const formattedNumber = number.replace(' ', '');
      return  (formattedNumber.startsWith('07') || formattedNumber.startsWith('00') || formattedNumber.startsWith('+'))  &&
      !formattedNumber.startsWith('070') && !formattedNumber.startsWith('076');
    } else {
      return false;
    }
  }
  isInternationalNumber(number: string) {
    const formattedNumber = number.replace(' ', '').replace('+44','');
    return  formattedNumber.startsWith('00') || formattedNumber.startsWith('+');
  }
  getRegionCode(number: string) {
    const phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
        const rawNumber = phoneUtil.parseAndKeepRawInput(number, 'GB');
        return this.isInternationalNumber(number) ? phoneUtil.getRegionCodeForNumber(rawNumber) : 'GB';
  }

  scrollToFirstInvalidField() {
    const invalidFields = document.getElementsByClassName('is-invalid');
    if(invalidFields.length){
      setTimeout(()=>{
        if(invalidFields[0]){
          invalidFields[0].scrollIntoView({block: 'center'});
        }
      })
    }
  }

  getDropdownListInfo(): Observable<DropdownListInfo> {
    if (this.infoDetail) {
      console.log('info cache', this.infoDetail);
      return of(this.infoDetail);
    }

    return this.http.get<DropdownListInfo>(AppConstants.baseInfoUrl)
      .pipe(
        tap(data => {
          if (data) {
            this.infoDetail = data;
          }}),
          shareReplay(1)
        // publishReplay(1),
        // refCount(),
        // take(1),
        // tap((data) => console.log('info from db', data))
      );
  }

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
      tap(data => console.log('address here', JSON.stringify(data))),
      tap(data => console.log('address here', data)),
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
      tap(data => console.log('retrieve address here', data)),
      );
  }
}

export interface DropdownListInfo {
 Countries: InfoDetail[];
 CompanyTypes: InfoDetail[];
 Titles: Record<number, string>;
 TelephoneTypes: Record<number, string>;
 PropertyStyles: InfoDetail[];
 PropertyTypes: InfoDetail[];
 PersonWarningStatuses: InfoDetail[];
}

export interface InfoDetail {
  id: number;
  value: string;
  parentId: number;
}

export class WedgeError {
  errorCode: number;
  requestId: string;
  technicalDetails: string;
  message: string;
  displayMessage: string;
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
