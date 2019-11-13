import { Component, OnInit } from '@angular/core';
import { AppUtils } from 'src/app/core/shared/utils';
import { PersonInstruction } from 'src/app/core/models/person';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PeopleService } from 'src/app/core/services/people.service';
import { tap } from 'rxjs/operators';

@Component({
  selector: 'app-contactgroups-detail-instructions',
  templateUrl: './contactgroups-detail-instructions.component.html',
  styleUrls: ['./contactgroups-detail-instructions.component.scss']
})
export class ContactgroupsDetailInstructionsComponent implements OnInit {
  navPlaceholder: string;
  personId: number;
  instructions$ = new Observable<PersonInstruction[]>();
  isShortLet: boolean;

  constructor(private route: ActivatedRoute, private peopleService: PeopleService) { }

  ngOnInit() {
    this.navPlaceholder = AppUtils.navPlaceholder;
    this.personId = +this.route.snapshot.paramMap.get('personId');
    if (this.personId) {
      this.instructions$ = this.peopleService.getInstructions(this.personId);
      tap((data: PersonInstruction[]) => {
        if (data && data.length) {
          data.find(x => +x.shortLetAmount > 0) ? this.isShortLet = true : this.isShortLet = false;
        }
      });
    }
  }
}
