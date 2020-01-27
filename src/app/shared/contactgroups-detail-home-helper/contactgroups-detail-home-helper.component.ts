import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonHomeHelper } from 'src/app/shared/models/person';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';
import { tap, catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { WedgeError, SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-contactgroups-detail-home-helper',
  templateUrl: './contactgroups-detail-home-helper.component.html',
  styleUrls: ['./contactgroups-detail-home-helper.component.scss']
})
export class ContactgroupsDetailHomeHelperComponent implements OnChanges {
  navPlaceholder: string;
  @Input() personId: number;
  @Input() closedCounter: number;
  isClosedIncluded: boolean = false;
  homeHelpers$ = new Observable<PersonHomeHelper[]>();
  errorMessage: WedgeError;
  constructor(private peopleService: PeopleService, private sharedService: SharedService) { }

  ngOnChanges() {
    if (this.personId) {
      this.getHomeHelpers();
    }
  }

  getHomeHelpers() {
    this.homeHelpers$ = this.peopleService.getHomeHelpers(this.personId, this.isClosedIncluded)
    .pipe(
      catchError((error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        return EMPTY;
      }));
  }

}
