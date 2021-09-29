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
} from "src/app/contactgroups/shared/contact-group";

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

  constructor(
    private fb: FormBuilder,
    private _valuationService: ValuationService,
    private _sharedService: SharedService
  ) {}

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

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
        Validators.required,
      ],
    });

    this.landRegistryForm.controls["leaseExpiryDate"].valueChanges.subscribe(
      (data: Date) => {
        this.leaseYear = differenceInCalendarYears(data, new Date());
      }
    );
    this.landRegistryForm.valueChanges.subscribe((data) => {
      this.deedLandReg.userEnteredOwner = data.userEnteredOwner;
      this.deedLandReg.ownerConfirmed = data.ownerConfirmed;
      this.leaseLandReg.leaseExpiryDate = new Date(data.leaseExpiryDate);
      if (this.controlValidation) {
        this._valuationService.validationControlBs.next(
          this._sharedService.logValidationErrors(this.landRegistryForm, true)
        );
        this.controlFiles();
      }
    });

    this.subscription = this._valuationService.valuationValidation$.subscribe(
      (data) => {
        this.controlValidation = data;
        if (data === true) {
          this.controlFiles();
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
          if (this.lengthOfContacts <= 1) this.contactNamesQuestion = "Is";
          contactListExceptAdmin.forEach((x) => {
            this.contactNamesQuestion += " " + x.firstName + " " + x.lastName;
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
    result =
      this._sharedService.logValidationErrors(this.landRegistryForm, true) &&
      !this.showFileUploadForNameChangeError &&
      !this.showFileUploadForLeaseError &&
      !this.showFileUploadForDeedError;

    this._valuationService.landRegisterValid.next(result);
    return result;
  }

  controlFiles() {
    if (this.controlValidation) {
      if (!(this.deedLandReg.files && this.deedLandReg.files.length > 0)) {
        this.showFileUploadForDeedError = true;
      } else this.showFileUploadForDeedError = false;
      if (!(this.leaseLandReg.files && this.leaseLandReg.files.length > 0)) {
        this.showFileUploadForLeaseError = true;
      } else this.showFileUploadForLeaseError = false;
      if (
        this.deedLandReg.ownerConfirmed == 3 &&
        !(this.nameChangeReg.files && this.nameChangeReg.files.length > 0)
      ) {
        this.showFileUploadForNameChangeError = true;
      } else this.showFileUploadForNameChangeError = false;
    }
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
    //this.afterFileOperation.emit();
    this.controlFiles();
  }
}
