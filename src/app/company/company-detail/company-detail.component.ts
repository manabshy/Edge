import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Company, BasicContactGroup } from 'src/app/contact-groups/shared/contact-group';
import { CompanyService } from '../shared/company.service';

@Component({
  selector: 'app-company-detail',
  templateUrl: './company-detail.component.html'
})
export class CompanyDetailComponent implements OnInit {
  companyDetails: Company;
  companyContacts: BasicContactGroup[];
  errorMessage: any;
  isNewCompany: boolean;
  companyId: number;
  isEditingSelectedCompany: boolean;
  isNewContactGroup: boolean;
  isExistingCompany: boolean;

  constructor(private contactGroupService: ContactGroupsService,
    private companyService: CompanyService,
    private sharedService: SharedService,
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    console.log('im  here 1', this.companyId);
    this.route.params.subscribe(params => this.companyId = this.companyId || +params['id'] || 0);
    this.route.queryParams.subscribe(params => {
      this.isNewCompany = this.companyId ? false : params['isNewCompany'];
      this.isEditingSelectedCompany = params['isEditingSelectedCompany'] || false;
      this.isExistingCompany = params['isExistingCompany'] || false;
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
    this.contactGroupService.getCompany(id, true).subscribe(data => {
      if (data) {
        this.companyDetails = data;

        this.sharedService.setTitle(this.companyDetails.companyName);
      }
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
      this.router.navigate(['/contact-centre/detail/0/people/0'],
        {
          queryParams:
          {
            isNewCompanyContact: true,
            isExistingCompany: true,
            existingCompanyId: this.companyId
          }
        });
    } else {
      this.router.navigate(['/company-centre/detail/0/edit'], { queryParams: { isNewCompany: true } });
    }
    this.companyDetails ? this.companyService.companyChanged(this.companyDetails) : this.companyService.companyChanged(null);
  }

}
