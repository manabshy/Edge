import { Component, OnInit, OnChanges, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() isLead: boolean;
  @Input() isLeadClosed: boolean;
  @Input() moreInfo: string;
  @Output() associatedProperty = new EventEmitter<PersonProperty>();
  properties$ = new Observable<PersonProperty[]>();
  constructor(private router: Router, private peopleService: PeopleService) { }

  ngOnChanges() {
    console.log('more info for properts', this.moreInfo)
    if (this.personId && this.moreInfo && this.moreInfo.includes('properties')) {
      this.properties$ = this.peopleService.getProperties(this.personId);
    }
  }

  navigateToDetails(property: PersonProperty) {
    if (property) {
      console.log('property', property);
      this.router.navigate(['property-centre/detail', property.propertyId]);
    }
  }

  navigateToNewValuation(propertyId: number) {
    event.stopPropagation();
    this.router.navigate(['valuations-register/detail/', 0, 'edit'], {
      queryParams: {
        propertyId: propertyId,
        isNewValuation: true,
        isFromProperty: true,
        lastKnownOwnerId: this.personId
      }
    });
  }

  associateToLead(property: PersonProperty) {
    event.stopPropagation();
    if (property) {
      this.associatedProperty.emit(property);
    }
  }
}
