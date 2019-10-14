import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { OfferInfo } from '../shared/property';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { tap } from 'rxjs/operators';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { InfoService } from 'src/app/core/services/info.service';

@Component({
  selector: 'app-property-detail-offers',
  templateUrl: './property-detail-offers.component.html',
  styleUrls: ['./property-detail-offers.component.scss']
})
export class PropertyDetailOffersComponent implements OnInit {
  propertyId: number;
  offers$ = new Observable<OfferInfo[]>();
  offersData: OfferInfo[];
  listInfo: any;
  propertySaleStatuses: any;
  propertyLettingStatuses: any;
  offerSaleStatuses: any;
  offerLettingStatuses: any;
  status: any;
  navPlaceholder: string;

  constructor(private route: ActivatedRoute,
    private propertyService: PropertyService,
    private infoService: InfoService,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.infoService.info$.subscribe(data => {
      if (data) {
         this.listInfo = data;
         this.setStatusesInfo();
      }
       console.log('info changes property detail here', data);
     });
     
    this.propertyId = +this.route.snapshot.paramMap.get('id') || 0;
    if (this.propertyId) {
      this.offers$ = this.propertyService.getPropertyOffers(this.propertyId)
        .pipe(
          tap(data => this.offersData = data),
          tap(data => {
            if (data) {
              this.setPropertyStatus();
            }
          }));
    }
  }

  setStatusesInfo() {
   if (this.listInfo) {
      this.propertySaleStatuses = this.listInfo.result.propertySaleStatuses;
      this.propertyLettingStatuses = this.listInfo.result.propertyLettingStatuses;
      this.offerSaleStatuses = this.listInfo.result.offerSaleStatuses;
      this.offerLettingStatuses = this.listInfo.result.offerLettingStatuses;
   }
  }

  setPropertyStatus() {
    this.offersData.forEach((item) => {
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
