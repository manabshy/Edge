import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { PersonProperty } from '../models/person';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';

@Component({
  selector: 'app-shared-property-list',
  templateUrl: './shared-property-list.component.html',
  styleUrls: ['./shared-property-list.component.scss']
})
export class SharedPropertyListComponent implements OnChanges {

  @Input() personId: number;
  @Input() isLead: number;
  properties$ = new Observable<PersonProperty[]>();

  constructor(private router: Router, private peopleService: PeopleService) { }

  ngOnChanges() {
    if (this.personId) {
      this.properties$ = this.peopleService.getProperties(this.personId);
    }
  }
  navigateToDetails(property: PersonProperty) {
    if (property) {
      console.log('property', property)
      this.router.navigate(['property-centre/detail', property.propertyId]);
    }
  }
}
