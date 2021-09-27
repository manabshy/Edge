import { Component, Input, OnChanges, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import moment from "moment";
import { ValuationTypeEnum } from "../shared/valuation";

@Component({
  selector: "app-valuations-terms-of-business",
  templateUrl: "./valuations-terms-of-business.component.html"
})
export class ValuationsTermsOfBusinessComponent implements OnInit, OnChanges {
  @Input() valuationFiles: any[] = [];
  @Input() valuationForm: FormGroup;
  @Input() interestList: any[] = [];
  @Input() formErrors;
  @Input() tableType: ValuationTypeEnum
  @Input() valuationStatus: number
  @Input() dateRequestSent: Date;

  isTermOfBusinessSigned = false;
  moment = moment

  public get valuationType(): typeof ValuationTypeEnum {
    return ValuationTypeEnum; 
  }

  informationMessage =
    "If property is owned by a D&G employee, employee relation or business associate e.g. Laurus Law, Prestige, Foxtons Group";

  constructor() {}

  ngOnInit(): void {
    this.checkToBIsSigned()
  }
  
  ngOnChanges(changes): void {
    if(!changes.valuationFiles.firstChange){
      this.valuationFiles = changes.valuationFiles.currentValue
      this.checkToBIsSigned()
    }
  }

  checkToBIsSigned(){
    try{
      this.isTermOfBusinessSigned = !!this.valuationFiles.length;
    } catch(e){
      console.error(e)
      this.isTermOfBusinessSigned = false
    }
  }

}
