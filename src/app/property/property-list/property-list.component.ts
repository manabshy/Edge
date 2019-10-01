import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { PropertyAutoComplete, Property } from '../shared/property';
import { Observable } from 'rxjs';
import { PropertyService } from '../shared/property.service';
import { tap } from 'rxjs/operators';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnChanges {
  @Input() originalProperties: PropertyAutoComplete[];
  @Input() searchTerm: string;
  properties: PropertyAutoComplete[];


  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.originalProperties) {
      this.properties = this.originalProperties.slice(0, 15);
    }
  }

  onScrollDown() {
    AppUtils.setupInfintiteScroll(this.originalProperties, this.properties);
    console.log('scrolled down!!');
  }

  onPropertySelected(propertyId: string) {
    this.propertyService.currentPropertyChanged(+propertyId);
  }

}
