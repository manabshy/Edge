import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from 'src/app/property/shared/property.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { SharedService } from 'src/app/core/services/shared.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { Observable } from 'rxjs';
import { PersonSearch } from 'src/app/shared/models/person';

@Component({
  selector: 'app-contactgroups-detail-searches',
  templateUrl: './contactgroups-detail-searches.component.html',
  styleUrls: ['./contactgroups-detail-searches.component.scss']
})
export class ContactgroupsDetailSearchesComponent implements OnInit {
  navPlaceholder: string;
  personId: number;
  searches$ = new Observable<PersonSearch[]>();

  constructor(private route: ActivatedRoute, private peopleService: PeopleService) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.personId = +this.route.snapshot.paramMap.get('personId');
    if (this.personId) {
      this.searches$ = this.peopleService.getSearches(this.personId);
    }
  }

}
