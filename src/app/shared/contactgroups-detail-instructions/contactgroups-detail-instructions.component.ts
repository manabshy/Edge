import { Component, Input, OnChanges } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonInstruction } from 'src/app/shared/models/person';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';
import { tap } from 'rxjs/operators';
import { PropertyService } from 'src/app/property/shared/property.service';
import { InstructionInfo } from 'src/app/property/shared/property';

@Component({
  selector: 'app-contactgroups-detail-instructions',
  templateUrl: './contactgroups-detail-instructions.component.html',
  styleUrls: ['./contactgroups-detail-instructions.component.scss']
})
export class ContactgroupsDetailInstructionsComponent implements OnChanges {
  instructions$ = new Observable<any>();
  isShortLet: boolean;
  hidePrevious: boolean = false;
  @Input() moreInfo: string;
  @Input() personId: number;
  @Input() propertyId: number;
  @Input() closedCounter: number;

  constructor(private route: ActivatedRoute, private peopleService: PeopleService, private propertyService: PropertyService) { }

  ngOnChanges() {
    if (this.moreInfo?.includes('instructions')) {
      this.getInstructions();
    }
  }

  getInstructions() {
    if (this.personId) {
      this.instructions$ = this.peopleService.getInstructions(this.personId, this.hidePrevious);
      tap((data: PersonInstruction[]) => {
        if (data && data.length) {
          data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
        }
      });
    } else if (this.propertyId) {
      this.instructions$ = this.propertyService.getPropertyInstructions(this.propertyId, this.hidePrevious)
        .pipe(
          tap((data: InstructionInfo[]) => {
            if (data && data.length) {
              data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
            }
          }));
    }
  }
}
