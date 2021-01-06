import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Observable } from 'rxjs';
import { Photo } from '../shared/property';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-property-detail-map',
  templateUrl: './property-detail-map.component.html',
  styleUrls: ['./property-detail-map.component.scss']
})
export class PropertyDetailMapComponent implements OnInit, OnChanges {
  @Input() propertyMap: Photo;
  @Input() showMap = false;
  @Output() mapClosed = new EventEmitter<boolean>();

  propertyMap$: Observable<Photo>;
  propertyId: number;
  navPlaceholder: string;
  maps = [];

  constructor(private propertyService: PropertyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    // this.propertyId = +this.route.snapshot.paramMap.get('id');
    // this.propertyMap$ = this.propertyService.getPropertyMap(this.propertyId);
  }

  ngOnChanges() {
    if (this.propertyMap) {
      this.maps.push(this.propertyMap);
    }
  }
  
  hideModal() {
    this.mapClosed.emit();
  }
}
