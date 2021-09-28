import { Component, OnInit } from "@angular/core";
import { StorageMap } from "@ngx-pwa/local-storage";
import { takeUntil } from "rxjs/operators";
import {
  DropdownListInfo,
  InfoService,
} from "src/app/core/services/info.service";
import { BaseComponent } from "src/app/shared/models/base-component";
import { ResultData } from "src/app/shared/result-data";

@Component({
  selector: "app-cancel-valuation",
  templateUrl: "./cancel-valuation.component.html",
  styleUrls: ["./cancel-valuation.component.scss"],
})
export class CancelValuationComponent extends BaseComponent implements OnInit {
  reason: any;
  reasons: any;
  constructor(private storage: StorageMap, private infoService: InfoService) {
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
  }
}
