import { Component, OnInit, Input, OnChanges, HostListener, OnDestroy } from '@angular/core';

import { PropertyAutoComplete } from '../shared/property';
import { PropertyService } from '../shared/property.service';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit, OnChanges, OnDestroy {
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
  
  ngOnDestroy() {
    this.searchTerm = '';
    this.bottomReached = true;
    this.page = 1;
    this.properties = []
    console.log('search term destroyed', this.searchTerm)
    console.log('search term destroyed and page no', this.page)
    console.log('is bottom reached', this.bottomReached)
    
  }
  onScrollDown() {
    this.onWindowScroll();
    console.log('scrolled')
  }

  onPropertySelected(propertyId: string) {
    this.propertyService.currentPropertyChanged(+propertyId);
    // this.bottomReached = true;
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    if (window.innerHeight + window.scrollY === document.body.scrollHeight && !this.bottomReached) {
      this.page++;
      this.propertyService.propertyPageNumberChanged(this.page);
      console.log('properties page number', this.page)
    }
  }
}
