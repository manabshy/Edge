import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-detail-map',
  templateUrl: './property-detail-map.component.html',
  styleUrls: ['./property-detail-map.component.scss']
})
export class PropertyDetailMapComponent implements OnInit {

  zoom: number = 15;
  lat: number = 51.678418;
  lng: number = 7.809007;
  
  constructor() { }

  ngOnInit() {
  }

}
