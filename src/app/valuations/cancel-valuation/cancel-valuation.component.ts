import { CancelValuation } from "./../shared/valuation";
import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";
import { takeUntil } from "rxjs/operators";
import {
  DropdownListInfo,
  InfoDetail,
  InfoService,
} from "src/app/core/services/info.service";
import { BaseComponent } from "src/app/shared/models/base-component";
import { ResultData } from "src/app/shared/result-data";
import { ValuationCancellationReasons } from "../shared/valuation";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FormErrors } from "src/app/core/shared/app-constants";
import { ValuationFacadeService } from "../shared/valuation-facade.service";
import { SharedService } from "src/app/core/services/shared.service";

@Component({
  selector: "app-cancel-valuation",
  templateUrl: "./cancel-valuation.component.html",
  styleUrls: ["./cancel-valuation.component.scss"],
})
export class CancelValuationComponent extends BaseComponent implements OnInit {
  reasons: InfoDetail[];
  formErrors = FormErrors;
  cancelValuationForm: FormGroup;
  isDescriptionVisible = false;
  @Input() valuationEventId;
  @Output()
  cancelOperationFinished: EventEmitter<boolean> = new EventEmitter();
  constructor(
    private storage: StorageMap,
    private infoService: InfoService,
    private fb: FormBuilder,
    private _valuationFacadeService: ValuationFacadeService,
    private sharedService: SharedService
  ) {
    super();
  }

  ngOnInit(): void {
    let dropdownList: DropdownListInfo;
    this.storage.get("info").subscribe((info: DropdownListInfo) => {
      if (info) {
        dropdownList = info;
        this.reasons = dropdownList.valuationCancellationReasons;
      } else {
        this.infoService
          .getDropdownListInfo()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: ResultData | any) => {
            if (data) {
              dropdownList = data.result;
              this.reasons = dropdownList.valuationCancellationReasons;
            }
          });
      }
    });

    this.cancelValuationForm = this.fb.group({
      cancelTypeId: [null, Validators.required],
      cancelReason: [null],
    });

    this.cancelValuationForm.controls["cancelReason"].valueChanges.subscribe(
      (data) => {
        if (data) this.controlForm();
      }
    );
  }

  onReasonTypeChanged(value) {
    this.controlForm();
    if (value == ValuationCancellationReasons.Other) {
      this.setDescriptionRequired(true);
    } else {
      this.setDescriptionRequired(false);
    }
  }

  setDescriptionRequired(value: boolean) {
    if (value) {
      this.cancelValuationForm.controls["cancelReason"].setValidators(
        Validators.required
      );
      this.isDescriptionVisible = true;
    } else {
      this.cancelValuationForm.controls["cancelReason"].setValidators(null);
      this.isDescriptionVisible = false;
    }
    this.cancelValuationForm.controls["cancelReason"].updateValueAndValidity();
  }

  cancelOperation() {
    this.sharedService.cancelValuationOperationChanged.next(false);
  }

  controlForm() {
    this.sharedService.logValidationErrors(this.cancelValuationForm, true);
  }

  cancelValuation() {
    this.controlForm();
    if (this.cancelValuationForm.valid) {
      this._valuationFacadeService
        .cancelValuation({
          typeId: this.cancelValuationForm.get("cancelTypeId").value,
          reason: this.cancelValuationForm.get("cancelReason").value,
          valuationEventId: this.valuationEventId,
        })
        .subscribe(() => {
          this.sharedService.cancelValuationOperationChanged.next(false);
          this.cancelOperationFinished.emit(true);
        });
    }
  }
}
