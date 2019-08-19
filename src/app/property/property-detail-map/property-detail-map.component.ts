import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-property-detail-map',
  templateUrl: './property-detail-map.component.html',
  styleUrls: ['./property-detail-map.component.scss']
})
export class PropertyDetailMapComponent implements OnInit {

  zoom: number = 15;
  lat: number = 51.678418;
  lng: number = 7.809007;
  
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      if(params["lat"] && params["lng"]) {
        this.lat = +params["lat"];
        this.lng = +params["lng"];
      }
    })
  }

}
