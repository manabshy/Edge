import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-detail-photos',
  templateUrl: './property-detail-photos.component.html',
  styleUrls: ['./property-detail-photos.component.scss']
})
export class PropertyDetailPhotosComponent implements OnInit {
  itemsPerSlide = 1;
  singleSlideOffset = true;
  noWrap = false;

  slides = [
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/1.jpg'},
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/2.jpg'},
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/3.jpg'},
    {image: 'https://valor-software.com/ngx-bootstrap/assets/images/nature/4.jpg'}
  ];

  constructor() { }

  ngOnInit() {
  }

}
