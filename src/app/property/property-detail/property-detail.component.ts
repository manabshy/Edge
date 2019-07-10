import { Component, OnInit, HostListener } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { Property } from '../shared/property';

@Component({
  selector: 'app-property-detail',
  templateUrl: './property-detail.component.html',
  styleUrls: ['./property-detail.component.scss']
})
export class PropertyDetailComponent implements OnInit {
  propertyId: number;
  searchedPropertyDetails: Property;
  zoom: number = 15;
  lat: number = 51.678418;
  lng: number = 7.809007;

  itemsPerSlide = 3;
  singleSlideOffset = true;
  noWrap = false;

  slides = [
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/1.jpg'},
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/2.jpg'},
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/3.jpg'},
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/4.jpg'}
  ];

  constructor(private propertyService: PropertyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
    }
    this.responsiveCarousel();
  }

  getPropertyDetails(propertyId: number) {
    this.propertyService.getProperty(propertyId).subscribe(data => {
      this.searchedPropertyDetails = data;
      console.log(this.searchedPropertyDetails);
    });
  }

  @HostListener('window:resize')
  onresize() {
    this.responsiveCarousel();
  }

  responsiveCarousel() {
    if(window.innerWidth < 576) {
      this.itemsPerSlide = 1;
    } else {
      this.itemsPerSlide = 3;
    }
  }

}
