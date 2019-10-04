import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { PropertyService } from '../property.service';
import { Observable } from 'rxjs';
import { Address } from 'src/app/core/models/address';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-property-duplicate-checker',
  templateUrl: './property-duplicate-checker.component.html',
  styleUrls: ['./property-duplicate-checker.component.scss']
})
export class PropertyDuplicateCheckerComponent implements OnInit, OnChanges {
  @Input() propertyAddress: Address;
  @Output() selectedProperty = new EventEmitter<any>();
  selectedPropertyDetails: any;
  potentialDuplicates$ = new Observable<any>();
  isDuplicateFound = false;

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.propertyAddress) {
      console.log('property address here', this.propertyAddress);
      this.potentialDuplicates$ = this.propertyService.getPotentialDuplicateProperties(this.propertyAddress)
        .pipe(
          tap(data => { if (data) { this.isDuplicateFound = true; } }),
          tap(data => console.log('duplicates', data))
        );
    }
  }

  selectProperty(propertyId: number) {
    if (propertyId) {
      this.propertyService.getProperty(propertyId).subscribe(data => {
        if (data) {
          this.selectedProperty.emit(data);
        }
      });
    }
  }
}


