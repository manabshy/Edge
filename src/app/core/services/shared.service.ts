import { Injectable, ElementRef } from "@angular/core";
import { AppUtils, RequestOption } from "../shared/utils";
import dayjs from "dayjs";
import { BehaviorSubject, Subject } from "rxjs";
import { map, fill } from "lodash";
import { BsModalService } from "ngx-bootstrap/modal/";
import { ErrorModalComponent } from "../../shared/error-modal/error-modal.component";
import { NoteModalComponent } from "../../shared/note-modal/note-modal.component";
import { PhoneNumberUtil } from "google-libphonenumber";
import { CurrencyPipe, Location } from "@angular/common";
import { Title } from "@angular/platform-browser";
import { AbstractControl, FormGroup } from "@angular/forms";
import { Router } from "@angular/router";
import { StorageMap } from "@ngx-pwa/local-storage";
import { ContactGroup } from "src/app/contact-groups/shared/contact-group";
import { ValidationMessages, FormErrors } from "../shared/app-constants";
import {
  Valuation,
  ValuationStatusEnum,
  ValuationTypeEnum,
} from "src/app/valuations/shared/valuation";
import { DialogService, DynamicDialogRef } from "primeng/dynamicdialog";
import { InfoDetail } from "./info.service";
import { eSignTypes } from "../shared/eSignTypes";

@Injectable({
  providedIn: "root",
})
export class SharedService {
  lastCallNoteToast: any;
  lastCallEndCallToast: any;
  formErrors: any;
  ref: DynamicDialogRef;
  private removeStickySubject = new Subject<boolean>();
  removeSticky$ = this.removeStickySubject.asObservable();

  openContactGroupChanged = new Subject<boolean>();
  removeContactGroupChanged = new Subject<boolean>();
  eSignTriggerChanged = new Subject<eSignTypes>();
  valuationStatusChanged = new BehaviorSubject<ValuationStatusEnum>(
    ValuationStatusEnum.None
  );
  valuationType = new BehaviorSubject<ValuationTypeEnum>(
    ValuationTypeEnum.None
  );
  cancelValuationOperationChanged = new BehaviorSubject<boolean>(false);

  constructor(
    private _location: Location,
    private _router: Router,
    private titleService: Title,
    private storage: StorageMap,
    private dialogService: DialogService,
    private modalService: BsModalService,
    private currencyPipe: CurrencyPipe
  ) {}

  transformCurrency(value: any): any {
    // if (
    //   value &&
    //   value.toString().length > 0 &&
    //   value.toString().indexOf("£") > -1
    // )
    //   return value;
    if (value) {
      let numberValue = this.convertStringToNumber(value.toString());
      return this.currencyPipe.transform(numberValue, "GBP", "symbol", "1.0-0");
    }
    return value;
  }

  convertStringToNumber(stringValue: string): number {
    let numberValue = "0";
    if (stringValue) {
      numberValue = stringValue.replace(/\D/g, "");
      numberValue = numberValue.replace(/\D/g, "").replace(/^0+/, "");
    }
    return +numberValue;
  }

  calculateDateToNowInMonths(valuationDate: Date): number {
    let subtractionOfMonths =
      new Date().getMonth() -
      valuationDate.getMonth() +
      12 * (new Date().getFullYear() - valuationDate.getFullYear());
    if (new Date().getDate() - valuationDate.getDate() < 0)
      subtractionOfMonths--;
    return subtractionOfMonths;
  }

  setRemoveSticky(removed: boolean) {
    this.removeStickySubject.next(removed);
  }

  back() {
    if (!(window.opener && window.opener !== window)) {
      if (AppUtils.deactivateRoute) {
        this._router.navigateByUrl(AppUtils.deactivateRoute);
        AppUtils.deactivateRoute = "";
      } else {
        this._location.back();
      }
    } else {
      window.close();
    }
  }

  setTitle(title: string) {
    this.titleService.setTitle(title);
  }

  clearControlValue(control: AbstractControl) {
    if (control.value) {
      control.setValue("");
      control.updateValueAndValidity();
      control.parent.markAsDirty();
    }
  }

  openLinkWindow(link: string) {
    const width = Math.floor(Math.random() * 100) + 860;
    const height = Math.floor(Math.random() * 100) + 500;
    const left = window.top.outerWidth / 2 + window.top.screenX - 960 / 2;
    const top = window.top.outerHeight / 2 + window.top.screenY - 600 / 2;
    const w = window.open(link, "_self");
    AppUtils.openedWindows.push(w);
    setTimeout(() => {
      AppUtils.openedWindows.forEach((x) => {
        x.focus();
      });
    });
  }

  showWarning(id: number, warnings: InfoDetail[], comment?: string): string {
    return warnings?.find((x) => x.id === id).value || comment;
  }

  showError(error: WedgeError, triggeredBy) {
    const subject = new Subject<boolean>();
    const data = {
      // title: error.requestId,
      // desc: error.displayMessage,
      // techDet: error.technicalDetails,
      triggeredBy,
      error,
    };
    console.log({ data });

    // const modal = this.modalService.show(ErrorModalComponent, { ignoreBackdropClick: true, initialState });
    // modal.content.subject = subject;
    this.ref = this.dialogService.open(ErrorModalComponent, {
      data,
      styleClass: "dialog dialog--hasFooter",
      header: "Error",
    });
    // this.ref.onClose.subscribe((res) => { if (res) { subject.next(true); subject.complete(); } });
    return subject.asObservable();
  }

  addNote(data: any) {
    const subject = new Subject<boolean>();
    const initialState = {
      data: data,
    };
    const modalClass = "modal-lg";
    const modal = this.modalService.show(NoteModalComponent, {
      class: modalClass,
      initialState,
    });
    modal.content.subject = subject;
    return subject.asObservable();
  }

  scrollElIntoView(className: string) {
    const els = document.getElementsByClassName(className);
    const headerOffset = 130;
    if (els.length) {
      const elementPosition = els[0].getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerOffset;

      if (elementPosition !== offsetPosition) {
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
      }
    }
  }

  scrollIntoView(element: ElementRef) {
    setTimeout(() => {
      if (element) {
        element.nativeElement.scrollIntoView();
      }
    });
  }

  scrollTodayIntoView() {
    setTimeout(() => {
      if (window.innerWidth < 576) {
        if (document.getElementById("today")) {
          document.getElementById("today").scrollIntoView({ block: "center" });
        } else {
          window.scrollTo(0, 0);
        }
      }
    });
  }

  scrollCurrentHourIntoView() {
    setTimeout(() => {
      const currentHour = dayjs().hour();
      const currentHourDivs = document.getElementsByClassName(
        "hour-" + currentHour
      );
      if (currentHourDivs) {
        for (let i = 0; i < currentHourDivs.length; i++) {
          currentHourDivs[i].scrollIntoView({ block: "center" });
        }
      }
    });
  }

  objectToMap(o) {
    const m = new Map();
    for (const k of Object.keys(o)) {
      if (o[k] instanceof Object) {
        m.set(k, this.objectToMap(o[k]));
      } else {
        m.set(k, o[k]);
      }
    }
    return m;
  }

  ISOToDate(date: Date): Date {
    let formattedDate = null;
    if (date) {
      formattedDate = dayjs(date).toDate();
    }
    return formattedDate;
  }

  checkDuplicateInContactGroup(
    contactGroupDetails: ContactGroup,
    personId: number
  ) {
    let isDuplicate = false;
    if (contactGroupDetails && contactGroupDetails.contactPeople) {
      contactGroupDetails.contactPeople.forEach((x) => {
        if (x && x.personId === personId) {
          isDuplicate = true;
        }
      });
    }
    return isDuplicate;
  }

  resetUrl(oldId: number, newId: number, isNew = true) {
    let url = this._router.url;
    let id = oldId;

    if (url.indexOf("detail/" + id) === -1) {
      id = 0;
    }
    if (url.indexOf("?") >= 0 && isNew) {
      url = url.substring(0, url.indexOf("?"));
      url = url.replace("detail/" + id, "detail/" + newId);
      this._location.replaceState(url);
      oldId = newId;
    }
  }

  logValidationErrors(
    group: FormGroup,
    fakeTouched: boolean,
    scrollToError = false
  ): boolean {
    let validationControl = true;
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        FormErrors[key] = "";
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = "";
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages ? messages[errorKey] + "\n" : "";
            validationControl = false;
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }
    });
    if (scrollToError) {
      this.scrollToFirstInvalidField();
    }
    return validationControl;
  }

  resetForm(form: FormGroup) {
    console.log("reset is called", form);
    form.reset();
    Object.keys(form.controls).forEach((key) => {
      form.get(key).setErrors(null);
    });
    console.log("reset is called after", form);
  }

  clearFormValidators(form: FormGroup, formErrors: any) {
    Object.keys(form.controls).forEach((key) => {
      formErrors[key] = "";
    });
  }

  // Accepts the array and key
  groupBy(array, key): [] {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      );
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, []); // empty object is the initial value for result object
  }

  // Accepts the array and key
  groupByDate(array): [] {
    // Return the end result
    return array.reduce((result, currentValue) => {
      // If an array already present for key, push it to the array. Else create an array and push the object
      // let currentValueArr = currentValue.split("+");
      (result[new Date(new Date(currentValue).toDateString()).getTime()] =
        result[new Date(new Date(currentValue).toDateString()).getTime()] ||
        []).push(new Date(currentValue));
      // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
      return result;
    }, []); // empty object is the initial value for result object
  }

  setValuationStatusLabel(vals: Valuation[]) {
    vals.forEach((x) => {
      x.valuationStatusLabel = ValuationStatusEnum[x.valuationStatus];
    });
  }

  // not working so duplicate in individual components for now. FIX ASAP
  setBottomReachedFlag(
    result: any,
    bottomReached?: boolean,
    pageSize?: number
  ) {
    if (result && (!result.length || result.length < +pageSize)) {
      bottomReached = true;
    } else {
      bottomReached = false;
    }
  }

  formatPostCode(postCodeToCheck: string) {
    // Permitted letters depend upon their position in the postcode.
    const alpha1 = "[abcdefghijklmnoprstuwyz]"; // Character 1
    const alpha2 = "[abcdefghklmnopqrstuvwxy]"; // Character 2
    const alpha3 = "[abcdefghjkpmnrstuvwxy]"; // Character 3
    const alpha4 = "[abehmnprvwxy]"; // Character 4
    const alpha5 = "[abdefghjlnpqrstuwxyz]"; // Character 5
    const BFPOa5 = "[abdefghjlnpqrst]"; // BFPO alpha5
    const BFPOa6 = "[abdefghjlnpqrstuwzyz]"; // BFPO alpha6

    // Array holds the regular expressions for the valid postcodes
    const pcexp = new Array();

    // BFPO postcodes
    pcexp.push(
      new RegExp(
        "^(bf1)(\\s*)([0-6]{1}" + BFPOa5 + "{1}" + BFPOa6 + "{1})$",
        "i"
      )
    );

    // Expression for postcodes: AN NAA, ANN NAA, AAN NAA, and AANN NAA
    pcexp.push(
      new RegExp(
        "^(" +
          alpha1 +
          "{1}" +
          alpha2 +
          "?[0-9]{1,2})(\\s*)([0-9]{1}" +
          alpha5 +
          "{2})$",
        "i"
      )
    );

    // Expression for postcodes: ANA NAA
    pcexp.push(
      new RegExp(
        "^(" +
          alpha1 +
          "{1}[0-9]{1}" +
          alpha3 +
          "{1})(\\s*)([0-9]{1}" +
          alpha5 +
          "{2})$",
        "i"
      )
    );

    // Expression for postcodes: AANA  NAA
    pcexp.push(
      new RegExp(
        "^(" +
          alpha1 +
          "{1}" +
          alpha2 +
          "{1}" +
          "?[0-9]{1}" +
          alpha4 +
          "{1})(\\s*)([0-9]{1}" +
          alpha5 +
          "{2})$",
        "i"
      )
    );

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
        postCode = RegExp.$1.toUpperCase() + " " + RegExp.$3.toUpperCase();

        // If it is a BFPO c/o type postcode, tidy up the "c/o" part
        postCode = postCode.replace(/C\/O\s*/, "c/o ");

        // If it is the Anguilla overseas territory postcode, we need to treat it specially
        if (postCodeToCheck.toUpperCase() === "AI-2640") {
          postCode = "AI-2640";
        }

        // Load new postcode back into the form element
        valid = true;

        // Remember that we have found that the code is valid and break from loop
        break;
      }
    }
    // Return with either the reformatted valid postcode or the original invalid postcode
    if (valid) {
      return postCode;
    } else {
      return postCodeToCheck;
    }
  }

  splitPostCode(postcode: string) {
    const postCodeParts: string[] = [];
    let outCode: string;
    let inCode: string;
    if (postcode) {
      outCode = postcode.split(" ")[0];
      inCode = postcode.split(" ")[1];
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
    return map(fill(new Array(30), 0), (v, i) => {
      v = pv;
      if (v < 1000) {
        v += 50;
      } else if (v >= 1000 && v < 2000) {
        v += 250;
      } else if (v >= 2000 && v < 5000) {
        v += 500;
      }
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
    return map(fill(new Array(30), 0), (vv, i) => {
      vv = pv;
      if (vv < 1000000) {
        vv += 50000;
      }
      if (vv >= 1000000 && vv < 2000000) {
        vv += 250000;
      }
      if (vv >= 2000000 && vv < 5000000) {
        vv += 500000;
      }
      pv = vv;
      return pv;
    });
  }

  isUKMobile(number: string) {
    if (number) {
      const formattedNumber = number?.replace(" ", "");
      return (
        (formattedNumber.startsWith("07") ||
          formattedNumber.startsWith("00") ||
          formattedNumber.startsWith("+")) &&
        !formattedNumber.startsWith("070") &&
        !formattedNumber.startsWith("076")
      );
    } else {
      return false;
    }
  }

  isInternationalNumber(number: string) {
    const formattedNumber = number.replace(" ", "").replace("+44", "");
    return formattedNumber.startsWith("00") || formattedNumber.startsWith("+");
  }

  getRegionCode(number: string) {
    const phoneUtil: PhoneNumberUtil = PhoneNumberUtil.getInstance();
    const rawNumber = phoneUtil.parseAndKeepRawInput(number, "GB");
    return this.isInternationalNumber(number)
      ? phoneUtil.getRegionCodeForNumber(rawNumber)
      : "GB";
  }

  scrollToFirstInvalidField() {
    const invalidFields = document.getElementsByClassName("invalid");
    if (invalidFields.length) {
      setTimeout(() => {
        if (invalidFields[0]) {
          invalidFields[0].scrollIntoView({ block: "center" });
        }
      });
    }
  }
}

export class WedgeError {
  errorCode: number;
  requestId: string;
  technicalDetails: string;
  message: string;
  displayMessage: string;
  requestUrl?: string;
}
