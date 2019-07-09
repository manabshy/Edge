import { Component, OnInit, Input } from '@angular/core';
import { PropertyAutoComplete } from '../shared/property';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
@Input()  properties: PropertyAutoComplete[];
  constructor() { }

  ngOnInit() {
  }

}
