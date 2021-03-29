import { Component, OnInit, OnChanges, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { Lead } from 'src/app/leads/shared/lead';
import { PeopleService } from 'src/app/core/services/people.service';
import { Router } from '@angular/router';
import { StorageMap } from '@ngx-pwa/local-storage';
import { StaffMember } from '../models/staff-member';

@Component({
  selector: 'app-shared-lead-register',
  templateUrl: './shared-lead-register.component.html',
  styleUrls: ['./shared-lead-register.component.scss']
})
export class SharedLeadRegisterComponent implements OnInit, OnChanges {

  @Input() personId: number;
  @Input() closedCounter: number;
  @Input() moreInfo: string;
  hidePrevious: boolean = false;
  leads$ = new Observable<Lead[]>();
  staffMemberId: number;
  isMyLead: boolean;

  constructor(private peopleService: PeopleService, private router: Router, private storage: StorageMap) { }

  ngOnInit() { this.getCurrentStaffMemberId(); }
  ngOnChanges() {
    if (this.personId && this.moreInfo && this.moreInfo.includes('leads')) {
      this.getLeads();
    }
  }

  getCurrentStaffMemberId() {
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.staffMemberId = data.staffMemberId;
      }
    });
  }

  leadClicked(lead: Lead) {
    const isMyLead = lead.ownerId === this.staffMemberId;
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['leads-register/edit', lead.leadId], { queryParams: { showNotes: true, isMyLead } }));
  }

  getLeads() {
    this.leads$ = this.peopleService.getLeads(this.personId, this.hidePrevious);
  }

}
