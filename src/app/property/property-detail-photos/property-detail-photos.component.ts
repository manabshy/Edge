import { Component, OnInit } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { FormatAddressPipe } from 'src/app/shared/format-address.pipe';
import { ActivatedRoute } from '@angular/router';
import { SharedService } from 'src/app/core/services/shared.service';
import { Photo } from '../shared/property';
import { Observable } from 'rxjs';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-property-detail-photos',
  templateUrl: './property-detail-photos.component.html',
  styleUrls: ['./property-detail-photos.component.scss']
})
export class PropertyDetailPhotosComponent implements OnInit {
  itemsPerSlide = 1;
  singleSlideOffset = true;
  noWrap = false;
  propertyId: number;
  propertyPhotos: Photo[];
  photos$: Observable<Photo[]>;
  navPlaceholder: string;

  constructor(private propertyService: PropertyService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.route.params.subscribe(params => {
      this.propertyId = +params['id'] || 0;
    });
    if (this.propertyId) {
      this.photos$ = this.propertyService.getPropertyPhoto(this.propertyId);
    }
  }

}
