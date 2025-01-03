import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PersonHomeHelper } from 'src/app/shared/models/person';
import { PeopleService } from 'src/app/core/services/people.service';
import { catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { WedgeError, SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contact-groups-detail-home-helper',
  templateUrl: './contact-groups-detail-home-helper.component.html',
  styleUrls: ['./contact-groups-detail-home-helper.component.scss']
})
export class ContactgroupsDetailHomeHelperComponent implements OnChanges {
  @Input() personId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  navPlaceholder: string;
  isClosedIncluded: boolean = false;
  homeHelpers$ = new Observable<PersonHomeHelper[]>();
  errorMessage: WedgeError;
  
  constructor(private peopleService: PeopleService, private sharedService: SharedService) { }

  ngOnChanges() {
    if (this.personId && this.moreInfo && this.moreInfo.includes('homeHelpers')) {
      this.getHomeHelpers();
    }
  }

  getHomeHelpers() {
    this.homeHelpers$ = this.peopleService.getHomeHelpers(this.personId, this.isClosedIncluded)
      .pipe(
        catchError((error: WedgeError) => {
          return EMPTY;
        }));
  }

}
