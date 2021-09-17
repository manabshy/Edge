import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Valuation, ValuationTypeEnum } from "../shared/valuation";

@Component({
  selector: "app-valuations-terms-of-business",
  templateUrl: "./valuations-terms-of-business.component.html"
})
export class ValuationsTermsOfBusinessComponent implements OnInit {
  @Input() valuation: Valuation[];
  @Input() valuationForm: FormGroup;
  @Input() interestList: any[] = [];
  @Input() formErrors;
  isTermOfBusinessSigned = false;
  lastEmailDate: Date = new Date();
  tableType: ValuationTypeEnum
  public get valuationType(): typeof ValuationTypeEnum {
    return ValuationTypeEnum; 
  }

  informationMessage =
    "If property is owned by a D&G employee, employee relation or business associate e.g. Laurus Law, Prestige, Foxtons Group";

  constructor() {}

  ngOnInit(): void {
    this.filterValuationKeys();
    this.isTermOfBusinessSigned = this.checkIfToBIsSigned();
    this.setTableType()
  }

  openDocument(valuationEventId: number) {}
  
  private filterValuationKeys(): void {
    console.log('this.valuation unfiltered: ', this.valuation);
   
     const allowed = [
      'instructionPriceDirection',
      'soleOrMulti',
      'valuationDate',
      'valuationFiles',
      'valuationType'
      ];

    const filtered = Object.keys(this.valuation)
      .filter(key => allowed.includes(key))
      .reduce((obj, key) => {
        obj[key] = this.valuation[key];
        return obj;
      }, {});

    console.log('filtered: ', filtered);
    this.valuation = [filtered];
  }

  private checkIfToBIsSigned(): boolean{
    // if theres any valuation files present then ToB has been signed.
    const isSigned = this.valuation.find(val => val.valuationFiles.length);
    return !!isSigned;
  }

  private setTableType(){
    this.tableType = ValuationTypeEnum.Sales
  }

}
