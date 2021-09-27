import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonLettingsManagement } from 'src/app/shared/models/person';
import { Observable, EMPTY } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contact-groups-detail-lettings-managements',
  templateUrl: './contact-groups-detail-lettings-managements.component.html',
  styleUrls: ['./contact-groups-detail-lettings-managements.component.scss']
})
export class ContactGroupsDetaillettingsManagementsComponent implements OnChanges {
  @Input() personId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  isClosedIncluded: boolean = false;
  managements$ = new Observable<PersonLettingsManagement[]>();
  errorMessage: WedgeError;
  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private sharedService: SharedService) { }

  ngOnChanges() {
    if (this.personId && this.moreInfo && this.moreInfo.includes('lettingsManagements')) {
      this.getLettingsManagements();
    }
  }

  getLettingsManagements() {
    this.managements$ = this.peopleService.getLettingsManagements(this.personId, this.isClosedIncluded)
      .pipe(
        catchError((error: WedgeError) => {
          return EMPTY;
        }));
  }

}
