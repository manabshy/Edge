import { Component, OnInit, Input, OnChanges, HostListener, OnDestroy } from '@angular/core';

import { PropertyAutoComplete } from '../shared/property';
import { PropertyService } from '../shared/property.service';
import { Router } from '@angular/router';

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

  constructor(private propertyService: PropertyService, private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.page = this.pageNumber;
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
    let scrollHeight: number, totalHeight: number;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;
    const url = this.router.url;
    const isPropertyCentre = url.endsWith('/property-centre');

    if (isPropertyCentre) {
      if (totalHeight >= scrollHeight && !this.bottomReached) {
        if (this.properties && this.properties.length) {
          this.page++;
          this.propertyService.propertyPageNumberChanged(this.page);
          console.log('properties page number', this.page)
        }
      }
    }
  }
}
