import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Lead } from 'src/app/leads/shared/lead';
import { PeopleService } from 'src/app/core/services/people.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-shared-lead-register',
  templateUrl: './shared-lead-register.component.html',
  styleUrls: ['./shared-lead-register.component.scss']
})
export class SharedLeadRegisterComponent implements OnChanges {

  @Input() personId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  isClosedIncluded: boolean = false;
  leads$ = new Observable<Lead[]>();

  constructor(private peopleService: PeopleService, private router: Router) { }

  ngOnChanges() {
    if (this.personId && this.moreInfo && this.moreInfo.includes('leads')) {
      this.getLeads();
    }
  }

  leadClicked(lead: Lead) {
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['leads-register/edit', lead.leadId], { queryParams: { showNotes: true } }));
  }

  getLeads() {
    this.leads$ = this.peopleService.getLeads(this.personId, this.isClosedIncluded);
  }

}
