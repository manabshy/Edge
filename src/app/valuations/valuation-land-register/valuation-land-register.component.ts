import { ValuationFacadeService } from './../shared/valuation-facade.service';
import { differenceInCalendarYears } from 'date-fns';
import { FormErrors } from 'src/app/core/shared/app-constants';
import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValuationTypeEnum } from '../shared/valuation';
import { FileTypeEnum } from 'src/app/core/services/file.service';
import { Observable, Subscription } from 'rxjs';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactType } from 'src/app/contact-groups/shared/contact-group';
import { Property } from 'src/app/property/shared/property';

@Component({
  selector: 'app-valuation-land-register',
  templateUrl: './valuation-land-register.component.html',
})
export class ValuationsLandRegisterComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() interestList: any[] = [];
  @Input() valuationStatus: number;

  private _property: Property;
  set property(value) {
    this._property = value;
  }
  @Input() get property(): Property {
    return this._property;
  }

  private _showLeaseExpiryDate: boolean;
  set showLeaseExpiryDate(value) {
    if (this._showLeaseExpiryDate != value) {
      this._showLeaseExpiryDate = value;
      if (this._showLeaseExpiryDate === true) {
        this.landRegistryForm?.controls['leaseExpiryDate'].setValidators(Validators.required);
      } else {
        this.landRegistryForm?.controls['leaseExpiryDate'].setValidators(null);
      }
      this.landRegistryForm?.controls['leaseExpiryDate'].updateValueAndValidity();
    }
  }
  @Input() get showLeaseExpiryDate(): boolean {
    return this._showLeaseExpiryDate;
  }

  @Input() valuation;

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
  contactNamesQuestion = '';
  lengthOfContacts: number = 1;
  controlFormValuesAndDocuments = false;

  constructor(
    private fb: FormBuilder,
    private _valuationService: ValuationFacadeService,
    private _sharedService: SharedService,
  ) {}

  ngOnInit(): void {
    this.landRegistryForm = this.fb.group({
      userEnteredOwner: [this.property?.userEnteredOwner, Validators.required],
      ownerConfirmed: [this.valuation.ownerConfirmed?.toString(), Validators.required],
      leaseExpiryDate: [
        this.property?.leaseExpiryDate ? new Date(this.property?.leaseExpiryDate) : null,
        this.showLeaseExpiryDate ? Validators.required : null,
      ],
    });

    this.getValidationResult();

    if (this.property?.leaseExpiryDate)
      this.leaseYear = differenceInCalendarYears(new Date(this.property.leaseExpiryDate), new Date());

    this.landRegistryForm.controls['leaseExpiryDate'].valueChanges.subscribe((data: Date) => {
      this.leaseYear = differenceInCalendarYears(data, new Date());
    });
    this.landRegistryForm.valueChanges.subscribe((data) => {
      if (this.property) {
        this.property.userEnteredOwner = data.userEnteredOwner;
        this.valuation.ownerConfirmed = data.ownerConfirmed;
        const ownerConfirmed = parseInt(data.ownerConfirmed)
        this._valuationService.updateLocalModel({ ownerConfirmed })
        this.property.leaseExpiryDate = data.leaseExpiryDate ? new Date(data.leaseExpiryDate) : null;
      }
      this.getValidationResult();
    });

    this.subscription = this._valuationService.valuationValidation$.subscribe((data) => {
      this.controlValidation = data;
      if (data === true) {
        this._sharedService.logValidationErrors(this.landRegistryForm, true);
        this._valuationService.validationControlBs.next(this.getValidationResult());
      }
    });

    this._valuationService.contactGroupBs.subscribe((data) => {
      let contactGroup = data;
      if (contactGroup) {
        this.contactNamesQuestion = 'Are';
        if (contactGroup.contactType != ContactType.CompanyContact && contactGroup.contactPeople) {
          let contactListExceptAdmin = contactGroup.contactPeople.filter((contact) => !contact.isAdminContact);
          this.lengthOfContacts = contactListExceptAdmin.length;
          let tmpLength = this.lengthOfContacts;
          if (this.lengthOfContacts <= 1) this.contactNamesQuestion = 'Is';
          contactListExceptAdmin.forEach((x) => {
            this.contactNamesQuestion += ' ' + x.firstName + ' ' + x.lastName + (tmpLength > 1 ? ' ,' : '');
            tmpLength--;
          });
        } else if (contactGroup.companyName) {
          this.contactNamesQuestion += ' ' + contactGroup.companyName;
        }
      }
    });
  }

  ngAfterViewInit(): void {}

  getValidationResult(): boolean {
    let result: boolean = false;
    result = this.landRegistryForm.valid && this.controlFiles();
    let ownerConfirmed = this.landRegistryForm.controls['ownerConfirmed'].value;
    this._valuationService.landRegisterValid.next(result && ownerConfirmed != '0');
    return result;
  }

  controlFiles() {
    if (!(this.valuation.deedLandRegFiles && this.valuation.deedLandRegFiles.length > 0)) {
      this.showFileUploadForDeedError = this.controlValidation ? true : false;
      return false;
    } else this.showFileUploadForDeedError = false;
    if (
      !(this.valuation.leaseLandRegFiles && this.valuation.leaseLandRegFiles.length > 0) &&
      this.showLeaseExpiryDate
    ) {
      this.showFileUploadForLeaseError = this.controlValidation ? true : false;
      return false;
    } else this.showFileUploadForLeaseError = false;
    if (
      +this.valuation.ownerConfirmed == 2 &&
      !(this.valuation.nameChangeRegFiles && this.valuation.nameChangeRegFiles.length > 0)
    ) {
      this.showFileUploadForNameChangeError = this.controlValidation ? true : false;
      return false;
    } else this.showFileUploadForNameChangeError = false;
    return true;
  }

  getFileNames(fileObj: any) {
    if (fileObj) {
      if (fileObj.type == 'L') {
        this.valuation.leaseLandRegFiles = [...fileObj.file];
        this._valuationService.updateLocalModel({ leaseLandRegFiles: [...fileObj.file] })
      } else if (fileObj.type == 'D') {
        this.valuation.deedLandRegFiles = [...fileObj.file];
        this._valuationService.updateLocalModel({ deedLandRegFiles: [...fileObj.file] })
      } else if (fileObj.type == 'P') {
        this.valuation.nameChangeRegFiles = [...fileObj.file];
        this._valuationService.updateLocalModel({ nameChangeRegFiles: [...fileObj.file] })
      }
    }
    this.controlFiles();
    this.getValidationResult();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
