import { Component, OnInit, Input } from '@angular/core';
import { PropertyAutoComplete, Property } from '../shared/property';
import { Observable } from 'rxjs';
import { PropertyService } from '../shared/property.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.scss']
})
export class PropertyListComponent implements OnInit {
@Input()  properties: PropertyAutoComplete[];
@Input() searchTerm: string;


  constructor(private propertyService: PropertyService) { }

  ngOnInit() {
  }

onPropertySelected(propertyId: string){
  this.propertyService.currentPropertyChanged(+propertyId);
}

}
