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
  leads$ = new Observable<Lead[]>();

  constructor(private peopleService: PeopleService, private router: Router) { }

  ngOnChanges() {
    if (this.personId) {
      this.leads$ = this.peopleService.getLeads(this.personId);
    }
  }

  leadClicked(lead: Lead) {
    this.router.navigate(['leads-register/edit', lead.leadId]);
  }

}
