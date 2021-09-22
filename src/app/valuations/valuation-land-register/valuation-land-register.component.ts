import { FormErrors } from "src/app/core/shared/app-constants";
import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ValuationTypeEnum } from "../shared/valuation";

@Component({
  selector: "app-valuation-land-register",
  templateUrl: "./valuation-land-register.component.html",
})
export class ValuationsLandRegisterComponent implements OnInit {
  @Input() interestList: any[] = [];
  @Input() valuationStatus: number;
  isValid: boolean = false;
  isTermOfBusinessSigned = false;
  lastEmailDate: Date = new Date();
  public get valuationType(): typeof ValuationTypeEnum {
    return ValuationTypeEnum;
  }

  formErrors = FormErrors;
  landRegistryForm: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.landRegistryForm = this.fb.group({
      titleDeedOwners: [null, Validators.required],
      isLegalOwner: [null, Validators.required],
      leaseExpiryDate: [null, Validators.required],
    });
  }
}
