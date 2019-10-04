import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';

import { PropertyAutoComplete } from '../shared/property';
import { PropertyService } from '../shared/property.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnChanges {
  @Input() properties: PropertyAutoComplete[];
  @Input() searchTerm: string;
  @Input() bottomReached: boolean;
  @Input() pageNumber: number;
  page: number;


  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.page = this.pageNumber;
  }

  onScrollDown() {
    this.onWindowScroll();
  }

  onPropertySelected(propertyId: string) {
    this.propertyService.currentPropertyChanged(+propertyId);
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.innerHeight + window.scrollY === document.body.scrollHeight && !this.bottomReached) {
      this.page++;
      this.propertyService.propertyPageNumberChanged(this.page);
    }
  }
}
