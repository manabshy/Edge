import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonLettingsManagement } from 'src/app/shared/models/person';
import { Observable, EMPTY } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { catchError } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-detail-lettings-managements',
  templateUrl: './contactgroups-detail-lettings-managements.component.html',
  styleUrls: ['./contactgroups-detail-lettings-managements.component.scss']
})
export class ContactgroupsDetaillettingsManagementsComponent implements OnInit {
  navPlaceholder: string;
  personId: number;
  managements$ = new Observable<PersonLettingsManagement[]>();
  errorMessage: WedgeError;
  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private sharedService: SharedService) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.personId = +this.route.snapshot.paramMap.get('personId');
    if (this.personId) {
      this.managements$ = this.peopleService.getLettingsManagements(this.personId)
        .pipe(
          catchError((error: WedgeError) => {
            this.errorMessage = error;
            this.sharedService.showError(this.errorMessage);
            return EMPTY;
          }));
    }
  }

}
