import { Component, Input, OnInit } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FormErrors } from "src/app/core/shared/app-constants";
import { Valuation } from "../shared/valuation";

@Component({
  selector: "app-valuations-termsof-business",
  templateUrl: "./valuations-termsof-business.component.html",
  styleUrls: ["./valuations-termsof-business.component.scss"],
})
export class ValuationsTermsofBusinessComponent implements OnInit {
  @Input() valuation: Valuation;
  @Input() valuationForm: FormGroup;
  @Input() interestList: any[] = [];
  @Input() formErrors;
  isTermOfBusinessSigned = false;
  lastEmailDate: Date = new Date();

  informationMessage =
    "If property is owned by a D&G employee, employee relation or business associate e.g. Laurus Law, Prestige, Foxtons Group";

  constructor() {}

  ngOnInit(): void {}

  openDocument(valuationEventId: number) {}
}
