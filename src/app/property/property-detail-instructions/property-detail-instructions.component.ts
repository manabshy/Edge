import { Component, Input, OnChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Observable } from 'rxjs';
import { InstructionInfo } from '../shared/property';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-property-detail-instructions',
  templateUrl: './property-detail-instructions.component.html',
  styleUrls: ['./property-detail-instructions.component.scss']
})
export class PropertyDetailInstructionsComponent implements OnChanges {
  @Input() propertyId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  isClosedIncluded: boolean = false;
  instructions$ = new Observable<InstructionInfo[]>();
  isShortLet = false;

  constructor(private propertyService: PropertyService) { }

  ngOnChanges() {
    if (this.propertyId && this.moreInfo && this.moreInfo.includes('instructions')) {
      this.getInstructions();
    }
  }

  getInstructions() {
    this.instructions$ = this.propertyService.getPropertyInstructions(this.propertyId, this.isClosedIncluded)
      .pipe(
        tap(data => {
          if (data && data.length) {
            data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
          }
        }));
  }

}

