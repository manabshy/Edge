import { Component, Input, OnChanges } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonInstruction } from 'src/app/shared/models/person';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-detail-instructions',
  templateUrl: './contactgroups-detail-instructions.component.html',
  styleUrls: ['./contactgroups-detail-instructions.component.scss']
})
export class ContactgroupsDetailInstructionsComponent implements OnChanges {
  instructions$ = new Observable<PersonInstruction[]>();
  isShortLet: boolean;
  isClosedIncluded: boolean = false;
  @Input() moreInfo: string;
  @Input() personId: number;
  @Input() closedCounter: number;

  constructor(private route: ActivatedRoute, private peopleService: PeopleService) { }

  ngOnChanges() {
    if (this.personId && this.moreInfo.includes('instructions')) {
      this.getInstructions();
    }
  }

  getInstructions() {
    this.instructions$ = this.peopleService.getInstructions(this.personId, this.isClosedIncluded);
    tap((data: PersonInstruction[]) => {
      if (data && data.length) {
        data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
      }
    });
  }
}
