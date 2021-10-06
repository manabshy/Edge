import { first } from "rxjs/operators";
import { ValuationService } from "./../shared/valuation.service";
import { differenceInCalendarYears } from "date-fns";
import { FormErrors } from "src/app/core/shared/app-constants";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  DeedLandReg,
  LeaseLandReg,
  NameChangeReg,
  ValuationTypeEnum,
} from "../shared/valuation";
import { FileTypeEnum } from "src/app/core/services/file.service";
import { Observable, Subscription } from "rxjs";
import { SharedService } from "src/app/core/services/shared.service";
import {
  ContactGroup,
  ContactType,
} from "src/app/contact-groups/shared/contact-group";

@Component({
  selector: "app-valuation-land-register",
  templateUrl: "./valuation-land-register.component.html",
})
export class ValuationsLandRegisterComponent
  implements OnInit, AfterViewInit, OnDestroy {
  @Input() interestList: any[] = [];
  @Input() valuationStatus: number;

  private _showLeaseExpiryDate: boolean;
  set showLeaseExpiryDate(value) {
    if (this._showLeaseExpiryDate != value) {
      this._showLeaseExpiryDate = value;
      if (this._showLeaseExpiryDate === true) {
        this.landRegistryForm.controls["leaseExpiryDate"].setValidators(
          Validators.required
        );
      } else {
        this.landRegistryForm.controls["leaseExpiryDate"].setValidators(null);
      }
      this.landRegistryForm.controls[
        "leaseExpiryDate"
      ].updateValueAndValidity();
    }
  }
  @Input() get showLeaseExpiryDate(): boolean {
    return this._showLeaseExpiryDate;
  }

  private _nameChangeReg: NameChangeReg;
  set nameChangeReg(value) {
    if (value && this._nameChangeReg != value) {
      this._nameChangeReg = value;
    } else {
      this._nameChangeReg = {};
    }
  }
  @Input() get nameChangeReg(): NameChangeReg {
    return this._nameChangeReg;
  }

  private _deedLandReg: DeedLandReg;
  set deedLandReg(value) {
    if (value && this._deedLandReg != value) {
      this._deedLandReg = value;
    } else {
      this._deedLandReg = {};
    }
  }
  @Input() get deedLandReg(): DeedLandReg {
    return this._deedLandReg;
  }

  private _leaseLandReg: LeaseLandReg;
  set leaseLandReg(value) {
    if (value && this._leaseLandReg != value) {
      this._leaseLandReg = value;
    } else {
      this._leaseLandReg = {};
    }
  }
  @Input() get leaseLandReg(): LeaseLandReg {
    return this._leaseLandReg;
  }

  @Output() afterFileOperation: EventEmitter<any> = new EventEmitter();
  isValid$: Observable<boolean> = this._valuationService.landRegisterValid;
  isTermOfBusinessSigned = false;
  lastEmailDate: Date = new Date();
  public get valuationType(): typeof ValuationTypeEnum {
    return ValuationTypeEnum;
  }

  subscription = new Subscription();

  formErrors = FormErrors;
  landRegistryForm: FormGroup;
  todaysDate = new Date();
  leaseYear = 0;
  fileType = FileTypeEnum.ImageAndDocument;
  showFileUploadForLeaseError = false;
  showFileUploadForDeedError = false;
  showFileUploadForNameChangeError = false;
  controlValidation = false;
  contactNamesQuestion = "";
  lengthOfContacts: number = 1;
  controlFormValuesAndDocuments = false;

  constructor(
    private fb: FormBuilder,
    private _valuationService: ValuationService,
    private _sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.landRegistryForm = this.fb.group({
      userEnteredOwner: [
        this.deedLandReg.userEnteredOwner,
        Validators.required,
      ],
      ownerConfirmed: [
        this.deedLandReg.ownerConfirmed?.toString(),
        Validators.required,
      ],
      leaseExpiryDate: [
        this.leaseLandReg.leaseExpiryDate
          ? new Date(this.leaseLandReg.leaseExpiryDate)
          : null,
        this.showLeaseExpiryDate ? Validators.required : null,
      ],
    });

    this.getValidationResult();

    this.landRegistryForm.controls["leaseExpiryDate"].valueChanges.subscribe(
      (data: Date) => {
        this.leaseYear = differenceInCalendarYears(data, new Date());
      }
    );
    this.landRegistryForm.valueChanges.subscribe((data) => {
      this.deedLandReg.userEnteredOwner = data.userEnteredOwner;
      this.deedLandReg.ownerConfirmed = data.ownerConfirmed;
      this.leaseLandReg.leaseExpiryDate = data.leaseExpiryDate
        ? new Date(data.leaseExpiryDate)
        : null;
      this.getValidationResult();
    });

    this.subscription = this._valuationService.valuationValidation$.subscribe(
      (data) => {
        this.controlValidation = data;
        if (data === true) {
          this._sharedService.logValidationErrors(this.landRegistryForm, true);
          this._valuationService.validationControlBs.next(
            this.getValidationResult()
          );
        }
      }
    );

    this._valuationService.contactGroupBs.subscribe((data) => {
      let contactGroup = data;
      if (contactGroup) {
        this.contactNamesQuestion = "Are";
        if (
          contactGroup.contactType != ContactType.CompanyContact &&
          contactGroup.contactPeople
        ) {
          let contactListExceptAdmin = contactGroup.contactPeople.filter(
            (contact) => !contact.isAdminContact
          );
          this.lengthOfContacts = contactListExceptAdmin.length;
          let tmpLength = this.lengthOfContacts;
          if (this.lengthOfContacts <= 1) this.contactNamesQuestion = "Is";
          contactListExceptAdmin.forEach((x) => {
            this.contactNamesQuestion +=
              " " +
              x.firstName +
              " " +
              x.lastName +
              (tmpLength > 1 ? " ," : "");
            tmpLength--;
          });
        } else if (contactGroup.companyName) {
          this.contactNamesQuestion += " " + contactGroup.companyName;
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  getValidationResult(): boolean {
    let result: boolean = false;
    result = this.landRegistryForm.valid && this.controlFiles();
    let ownerConfirmed = this.landRegistryForm.controls["ownerConfirmed"].value;
    this._valuationService.landRegisterValid.next(
      result && ownerConfirmed != "0"
    );
    return result;
  }

  controlFiles() {
    if (!(this.deedLandReg.files && this.deedLandReg.files.length > 0)) {
      this.showFileUploadForDeedError = this.controlValidation ? true : false;
      return false;
    } else this.showFileUploadForDeedError = false;
    if (
      !(this.leaseLandReg.files && this.leaseLandReg.files.length > 0) &&
      this.showLeaseExpiryDate
    ) {
      this.showFileUploadForLeaseError = this.controlValidation ? true : false;
      return false;
    } else this.showFileUploadForLeaseError = false;
    if (
      +this.deedLandReg.ownerConfirmed == 2 &&
      !(this.nameChangeReg.files && this.nameChangeReg.files.length > 0)
    ) {
      this.showFileUploadForNameChangeError = this.controlValidation
        ? true
        : false;
      return false;
    } else this.showFileUploadForNameChangeError = false;
    return true;
  }

  getFileNames(fileObj: any) {
    if (fileObj) {
      if (fileObj.type == "L") {
        this.leaseLandReg.files = [...fileObj.file];
      } else if (fileObj.type == "D") {
        this.deedLandReg.files = [...fileObj.file];
      } else if (fileObj.type == "P") {
        this.nameChangeReg.files = [...fileObj.file];
      }
    }
    this.controlFiles();
    this.getValidationResult();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
