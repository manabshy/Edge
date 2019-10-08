import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { PropertyService } from '../property.service';
import { Observable } from 'rxjs';
import { Address } from 'src/app/core/models/address';
import { tap } from 'rxjs/operators';
import { PropertyAutoComplete } from '../property';

@Component({
  selector: 'app-property-duplicate-checker',
  templateUrl: './property-duplicate-checker.component.html',
  styleUrls: ['./property-duplicate-checker.component.scss']
})
export class PropertyDuplicateCheckerComponent implements OnInit, OnChanges {
  @Input() propertyAddress: Address;
  @Output() selectedProperty = new EventEmitter<any>();
  potentialDuplicates: PropertyAutoComplete[] = [];
  isDuplicateFound = false;

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.propertyAddress && this.propertyAddress.postCode) {
      this.getDuplicates();
    }
  }

  selectProperty(propertyId: number) {
    if (propertyId) {
      this.propertyService.getProperty(propertyId, true, true).subscribe(data => {
        if (data) {
          this.selectedProperty.emit(data);
        }
      });
    }
  }

  private getDuplicates() {
    this.propertyService.getPotentialDuplicateProperties(this.propertyAddress).subscribe(data => {
      if (data && data.length) {
        this.potentialDuplicates = data;
        this.isDuplicateFound = true;
      }
    });
  }
}


