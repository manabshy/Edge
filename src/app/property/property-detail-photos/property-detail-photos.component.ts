import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { PropertyService } from '../shared/property.service';
import { FormatAddressPipe } from 'src/app/shared/pipes/format-address.pipe';
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
export class PropertyDetailPhotosComponent implements OnInit, OnChanges {
  @Input() propertyId: number;
  @Input() showPhotos = false;
  @Output() photosClosed = new EventEmitter<boolean>();
  itemsPerSlide = 1;
  singleSlideOffset = true;
  noWrap = false;
  propertyPhotos: Photo[];
  photos$: Observable<Photo[]>;
  navPlaceholder: string;
  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5
    },
    {
      breakpoint: '768px',
      numVisible: 3
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  responsiveOptions2: any[] = [
    {
      breakpoint: '1500px',
      numVisible: 5
    },
    {
      breakpoint: '1024px',
      numVisible: 3
    },
    {
      breakpoint: '768px',
      numVisible: 2
    },
    {
      breakpoint: '560px',
      numVisible: 1
    }
  ];

  // displayBasic: boolean = false;

  // displayBasic2: boolean;

  // displayCustom: boolean;

  // activeIndex: number = 0;


  constructor(private propertyService: PropertyService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
  }

  ngOnChanges() {
    if (this.propertyId) {
      this.photos$ = this.propertyService.getPropertyPhoto(this.propertyId);
    }
  }

  hideModal() {
    this.photosClosed.emit();
  }
}
