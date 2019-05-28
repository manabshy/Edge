import { Injectable } from '@angular/core';
import { AppUtils } from '../shared/utils';
import { Router } from '@angular/router';
import * as dayjs from 'dayjs';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from '../shared/app-constants';
import { map, fill } from 'lodash';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  get dropdownListInfo() {
    const listInfo = localStorage.getItem('dropdownListInfo');
    return JSON.parse(listInfo);
  }
  constructor(private router: Router, private http: HttpClient) { }

  back() {
    if (AppUtils.prevRoute) {
      this.router.navigate([AppUtils.prevRoute]);
    } else {
      this.router.navigate(['/home']);
    }
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
  /* tests to see if string is in correct UK style postcode: AL1 1AB, BM1 5YZ etc. */
  // public isValidPostcode(p: string) {
  //   const postcodeRegEx = /^[A-Z]{1,2}[A-Z0-9]{1,2} ?[0-9][A-Z]{2}$/i;
  //   return postcodeRegEx.test(p);
  // }

  // /*	formats a VALID postcode nicely: AB120XY -> AB1 0XY */
  // public formatPostcode(p: string) {
  //   if (this.isValidPostcode(p)) {
  //     const postcodeRegEx = /(^[A-Z]{1,2}[A-Z0-9]{1,2})([0-9][A-Z]{2}$)/i;
  //     return p.replace(postcodeRegEx, '$1 $2');
  //   } else {
  //     return p;
  //   }
  // }
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
  getDropdownListInfo(): Observable<DropdownListInfo> {
  return  this.http.get<DropdownListInfo>(AppConstants.baseInfoUrl)
  .pipe(
    tap(data => console.log(JSON.stringify(data))),
    tap(data => localStorage.setItem('dropdownListInfo', JSON.stringify(data))));
  }

}

export interface DropdownListInfo {
 Countries: Country[];
 Titles: Record<number, string>;
 TelephoneTypes: Record<number, string>;
}

export interface Country {
  id: number;
  value: string;
}
