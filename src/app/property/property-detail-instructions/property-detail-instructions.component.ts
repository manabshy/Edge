import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Observable } from 'rxjs';
import { InstructionInfo } from '../shared/property';
import { AppUtils } from 'src/app/core/shared/utils';
import { SharedService } from 'src/app/core/services/shared.service';
import { tap } from 'rxjs/operators';
import { InfoService } from 'src/app/core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';

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

  constructor(private route: ActivatedRoute,
    private propertyService: PropertyService,
    private infoService: InfoService,
    private storage: StorageMap,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data; 
        this.setStatusesInfo();
        console.log('list info property instructions....', this.listInfo);
      }
    });

    this.propertyId = +this.route.snapshot.paramMap.get('id') || 0;
    if (this.propertyId) {
      this.instructions$ = this.propertyService.getPropertyInstructions(this.propertyId)
        .pipe(
          tap(data => this.instructionsData = data),
          tap(data => {
            if (data && data.length) {
              this.setPropertyStatus();
              data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
            }
          }));
    }
  }

  setStatusesInfo() {
   if(this.listInfo) {
      this.propertySaleStatuses = this.listInfo.result.propertySaleStatuses;
      this.propertyLettingStatuses = this.listInfo.result.propertyLettingStatuses;
      this.offerSaleStatuses = this.listInfo.result.offerSaleStatuses;
      this.offerLettingStatuses = this.listInfo.result.offerLettingStatuses;
   }
  }

  setPropertyStatus() {
  if(this.listInfo && this.instructionsData) {
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

}

