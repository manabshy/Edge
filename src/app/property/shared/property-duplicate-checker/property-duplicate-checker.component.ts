import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { PropertyService } from '../property.service';
import { Address } from 'src/app/shared/models/address';
import { PropertyAutoComplete } from '../property';

@Component({
  selector: 'app-property-duplicate-checker',
  templateUrl: './property-duplicate-checker.component.html',
  styleUrls: ['./property-duplicate-checker.component.scss']
})
export class PropertyDuplicateCheckerComponent implements OnInit, OnChanges {
  @Input() propertyAddress: Address;
  @Input() propertyId: number;
  @Input() checkDuplicates = false;
  @Output() selectedProperty = new EventEmitter<any>();
  @Output() fullMatchFound = new EventEmitter<boolean>();
  potentialDuplicates: PropertyAutoComplete[] = [];
  showMatches = false;
  isDuplicateFound = false;
  isFullMatch = false;
  isLoading = false;

  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.propertyService.showPropertyDuplicatesChanges$.subscribe(data => {
      this.showMatches = data;
    });

    if (this.checkDuplicates && this.propertyAddress && this.propertyAddress.postCode || this.showMatches) {
      this.getDuplicates();
    }
  }

  selectProperty(propertyId: number) {
    if (propertyId) {
      this.propertyService.getProperty(propertyId, true, true, false).subscribe(data => {
        if (data) {
          this.selectedProperty.emit(data);
        }
      });
    }
  }

  getDuplicates() {
    this.isLoading = true;
    this.propertyService.getPotentialDuplicateProperties(this.propertyAddress, this.propertyId).subscribe(data => {
      this.isLoading = false;
      if (data && data.length) {
        this.potentialDuplicates = data;
        this.isDuplicateFound = true;
        this.getFullMatches(data);
      }
    });
  }

  private getFullMatches(matches: PropertyAutoComplete[]) {
    const properties = matches.filter(x => x.matchType === 'FullMatch');
    if (properties && properties.length) {
      this.isFullMatch = true;
    } else {
      this.isFullMatch = false;
    }
    this.fullMatchFound.emit(this.isFullMatch);
  }
}


