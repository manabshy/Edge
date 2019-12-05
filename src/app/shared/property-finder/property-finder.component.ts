import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-property-finder',
  templateUrl: './property-finder.component.html',
  styleUrls: ['./property-finder.component.css']
})
export class PropertyFinderComponent implements OnInit {

  property: string;

  isAddPropertyCollapsed = false;
  isManAddressCollapsed = false;
  
  constructor() { }

  ngOnInit() {
    this.property = '';
  }

}
