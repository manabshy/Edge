import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Observable } from 'rxjs';
import { InstructionInfo } from '../shared/property';
import { AppUtils } from 'src/app/core/shared/utils';
import { SharedService } from 'src/app/core/services/shared.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-property-detail-instructions',
  templateUrl: './property-detail-instructions.component.html',
  styleUrls: ['./property-detail-instructions.component.scss']
})
export class PropertyDetailInstructionsComponent implements OnInit {
  propertyId: number;
  instructions$ = new Observable<InstructionInfo[]>();
  instructionsData: InstructionInfo[] = [];
  listInfo: any;
  propertySaleStatuses: any;
  propertyLettingStatuses: any;
  offerSaleStatuses: any;
  offerLettingStatuses: any;
  status: any;
  isShortLet = false;

  constructor(private route: ActivatedRoute, private propertyService: PropertyService, private sharedService: SharedService) { }

  ngOnInit() {
    if (AppUtils.listInfo) {
      this.listInfo = AppUtils.listInfo.result;
      this.setStatusesInfo();
    } else {
      this.sharedService.getDropdownListInfo().subscribe(data => {
        this.listInfo = data;
        this.setStatusesInfo();
      });
    }
    this.propertyId = +this.route.snapshot.paramMap.get('id') || 0;
    if (this.propertyId) {
      this.instructions$ = this.propertyService.getPropertyInstructions(this.propertyId)
        .pipe(
          tap(data => this.instructionsData = data),
          tap(data => {
            if (data) {
              this.setPropertyStatus();
              data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
            }
          }));
    }
  }

  setStatusesInfo() {
    this.propertySaleStatuses = this.listInfo.propertySaleStatuses;
    this.propertyLettingStatuses = this.listInfo.propertyLettingStatuses;
    this.offerSaleStatuses = this.listInfo.offerSaleStatuses;
    this.offerLettingStatuses = this.listInfo.offerLettingStatuses;
  }

  setPropertyStatus() {
    this.instructionsData.forEach((item) => {
      switch (true) {
        case !!this.propertySaleStatuses:
          this.propertySaleStatuses.forEach(x => {
            if (x.id === item.statusId) {
              item.status = x.value;
            }
          });
          break;
        case !!this.propertyLettingStatuses:
          this.propertyLettingStatuses.forEach(x => {
            if (x.id === item.statusId) {
              item.status = x.value;
            }
          });
          break;
      }
    });
  }

}

