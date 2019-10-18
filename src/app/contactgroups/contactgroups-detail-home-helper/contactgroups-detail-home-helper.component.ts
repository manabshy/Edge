import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonHomeHelper } from 'src/app/core/models/person';
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
export class ContactgroupsDetailHomeHelperComponent implements OnInit {
  navPlaceholder: string;
  personId: number;
  homeHelpers$ = new Observable<PersonHomeHelper[]>();
  errorMessage: WedgeError;
  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private sharedService: SharedService) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.personId = +this.route.snapshot.paramMap.get('personId');
    if (this.personId) {
      this.homeHelpers$ = this.peopleService.getHomeHelpers(this.personId)
        .pipe(
          catchError((error: WedgeError) => {
            this.errorMessage = error;
            this.sharedService.showError(this.errorMessage);
            return EMPTY;
          }));
    }
  }

}
