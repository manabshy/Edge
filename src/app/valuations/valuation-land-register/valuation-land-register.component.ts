import { differenceInCalendarYears } from "date-fns";
import { FormErrors } from "src/app/core/shared/app-constants";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import {
  DeedLandReg,
  LeaseLandReg,
  NameChangeReg,
  ValuationTypeEnum,
} from "../shared/valuation";
import { FileTypeEnum } from "src/app/core/services/file.service";

@Component({
  selector: "app-valuation-land-register",
  templateUrl: "./valuation-land-register.component.html",
})
export class ValuationsLandRegisterComponent implements OnInit {
  @Input() interestList: any[] = [];
  @Input() valuationStatus: number;
  @Input() nameChangeReg: NameChangeReg;
  @Input() deedLandReg: DeedLandReg;
  @Input() leaseLandReg: LeaseLandReg;
  @Output() afterFileOperation: EventEmitter<any> = new EventEmitter();
  isValid: boolean = false;
  isTermOfBusinessSigned = false;
  lastEmailDate: Date = new Date();
  public get valuationType(): typeof ValuationTypeEnum {
    return ValuationTypeEnum;
  }

  formErrors = FormErrors;
  landRegistryForm: FormGroup;
  todaysDate = new Date();
  leaseYear = 0;
  fileType = FileTypeEnum.ImageAndDocument;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.landRegistryForm = this.fb.group({
      titleDeedOwners: [null, Validators.required],
      isLegalOwner: [null, Validators.required],
      leaseExpiryDate: [null, Validators.required],
    });

    this.landRegistryForm.controls["leaseExpiryDate"].valueChanges.subscribe(
      (data: Date) => {
        this.leaseYear = differenceInCalendarYears(data, new Date());
      }
    );
  }

  getFileNames(fileNames: string[]) {
    console.log(fileNames);
    this.afterFileOperation.emit();
  }
}
