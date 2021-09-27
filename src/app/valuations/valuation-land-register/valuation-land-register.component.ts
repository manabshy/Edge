import { ValuationService } from "./../shared/valuation.service";
import { differenceInCalendarYears } from "date-fns";
import { FormErrors } from "src/app/core/shared/app-constants";
import {
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
import { Subscription } from "rxjs";
import { SharedService } from "src/app/core/services/shared.service";

@Component({
  selector: "app-valuation-land-register",
  templateUrl: "./valuation-land-register.component.html",
})
export class ValuationsLandRegisterComponent implements OnInit, OnDestroy {
  @Input() interestList: any[] = [];
  @Input() valuationStatus: number;

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
  isValid: boolean = false;
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
      userEnteredOwner: [null, Validators.required],
      ownerConfirmed: [null, Validators.required],
      leaseExpiryDate: [null, Validators.required],
    });

    this.landRegistryForm.controls["leaseExpiryDate"].valueChanges.subscribe(
      (data: Date) => {
        this.leaseYear = differenceInCalendarYears(data, new Date());
      }
    );
    this.landRegistryForm.valueChanges.subscribe((data) => {
      this.deedLandReg.userEnteredOwner = data.userEnteredOwner;
      this.deedLandReg.ownerConfirmed = data.ownerConfirmed;
      this.leaseLandReg.leaseExpiryDate = data.leaseExpiryDate;
      this._valuationService.validationControlBs.next(
        this._sharedService.logValidationErrors(this.landRegistryForm, true)
      );
    });

    this.subscription = this._valuationService.valuationValidation$.subscribe(
      (data) => {
        if (data === true) {
          this.controlFiles();
          this._valuationService.validationControlBs.next(
            this._sharedService.logValidationErrors(
              this.landRegistryForm,
              true
            ) &&
              !this.showFileUploadForNameChangeError &&
              !this.showFileUploadForLeaseError &&
              !this.showFileUploadForDeedError
          );
        }
      }
    );
  }

  controlFiles() {
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

  getFileNames(fileObj: any) {
    if (fileObj) {
      if (fileObj.type == "L") {
        this.leaseLandReg.files = [...fileObj.file];
      } else if (fileObj.type == "D") {
        this.deedLandReg.files = [...fileObj.file];
      } else if (fileObj.type == "N") {
        this.nameChangeReg.files = [...fileObj.file];
      }
    }
    this.afterFileOperation.emit();
    this.controlFiles();
  }
}
