import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, BasicContactGroup } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html',
  styleUrls: ['./company-detail.component.scss']
})
export class CompanyDetailComponent implements OnInit {
  companyDetails: Company;
  companyContacts: BasicContactGroup[];
  errorMessage: any;
  isNewCompany: boolean;
  companyId: any;
  isEditingSelectedCompany: any;
  isNewContactGroup: boolean;

  constructor(private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('im  here 1', this.companyId);
    this.route.params.subscribe(params => this.companyId = this.companyId || +params['id'] || 0);
    this.route.queryParams.subscribe(params => {
      this.isNewCompany = this.companyId ? false : params['isNewCompany'];
      this.isEditingSelectedCompany = params['isEditingSelectedCompany'] || false;
    });

    if (this.companyId) {
      this.getCompanyDetails(this.companyId);
      this.getCompanyContacts(this.companyId);
    }
    console.log('im  here', this.companyId);
    // if (AppUtils.newSignerId) {
    //   this.getSignerDetails(AppUtils.newSignerId);
    // }
  }

  getCompanyDetails(id: number) {
    this.contactGroupService.getCompany(id).subscribe(data => {
      this.companyDetails = data;
      this.sharedService.setTitle(this.companyDetails.companyName);
    }, error => {
      this.errorMessage = <any>error;
      this.sharedService.showError(this.errorMessage);
    });
  }

  getCompanyContacts(personId: number) {
    this.contactGroupService.getPersonContactGroups(personId).subscribe(data => {
      if (data) {
        this.companyContacts = data;
        console.log('company contact here', data);
        // this.contactGroupService.contactInfoChanged(data);
      }
    });
  }
  createNewCompanyOrContact(event?: string) {
    if (event === 'newContact') {
      this.isNewContactGroup = true;
      this.router.navigate(['/contact-centre/detail/0/people/0'], { queryParams: { isNewContactGroup: true, isNewCompanyContact: true } });
    } else {
      this.isNewCompany = true;
      this.router.navigate(['/company-centre/detail/0/edit'], { queryParams: { isNewCompany: true } });
    }
  }
}
