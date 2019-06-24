import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ActivatedRoute } from '@angular/router';
import { Company } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-company-edit',
  templateUrl: './company-edit.component.html',
  styleUrls: ['./company-edit.component.scss']
})
export class CompanyEditComponent implements OnInit {
  companyForm: FormGroup;
  isSubmitting: boolean;
  listInfo: any;
  companyTypes: any;
  companyId: number;
  isNewCompany: boolean;
  companyDetails: Company;
  errorMessage: any;
  defaultCountryCode = 232;
  formErrors = {
    'firstName': '',
    'lastName': '',
    'middleName': '',
    'email': '',
    'emailAddresses': {
      'email': '',
    },
    'address': '',
    'number': '',
    'postCode': ''
  };
  constructor( private contactGroupService: ContactGroupsService,
              private fb: FormBuilder,
              private sharedService: SharedService,
              private route: ActivatedRoute
            ) { }

  ngOnInit() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.companyTypes = this.listInfo.result.companyTypes;
    this.route.params.subscribe(params => this.companyId = +params['id'] || 0);
    this.route.queryParams.subscribe(params => {
      this.isNewCompany = params['isNewCompany'] || false;
    });
    this.setupCompanyForm();
    const id = this.isNewCompany ? 0 : this.companyId;
    if (id) {
      this.getCompanyDetails(id);
    }
  }
  getCompanyDetails(id: number) {
    this.contactGroupService.getCompany(id).subscribe(data => {
      this.companyDetails = data;
      console.log('person details', this.companyDetails);
      this.displayCompanyDetails(data);
    }, error => {
      this.errorMessage = <any>error;
      this.sharedService.showError(this.errorMessage);
    });
  }
  displayCompanyDetails(company: Company) {
    if (this.companyForm) {
      this.companyForm.reset();
    }
    this.companyDetails = company;
    this.companyForm.patchValue({
      companyName: company.companyName,
      companyType: company.companyType,
      signers: company.signers,
      address: {
        postCode: company.companyAddress.postCode,
        countryId: company.companyAddress.countryId,
        country: company.companyAddress.country,
      },
      contactDetails: {
        telephone: company.contactDetails.telephone,
        fax: company.contactDetails.fax,
        website: company.contactDetails.website,
        email: company.contactDetails.email,
      }
    });
  }
  populateNewCompanyDetails() {
    if (this.companyForm) {
      this.companyForm.reset();
    }
    this.companyForm.patchValue({
      // companyName: this.companyDetails.companyName,
      companyType: this.companyDetails.companyType,
      signers: this.companyDetails.signers,
      address: {
        postCode: this.companyDetails.companyAddress.postCode,
        countryId: this.defaultCountryCode,
        country: this.companyDetails.companyAddress.country,
      },
      contactDetails: {
        telephone: this.companyDetails.contactDetails.telephone,
        fax: this.companyDetails.contactDetails.fax,
        website: this.companyDetails.contactDetails.website,
        email: this.companyDetails.contactDetails.email,
      }
    });
  }

  private setupCompanyForm() {
    this.companyForm = this.fb.group({
      companyName: [''],
      companyType: [''],
      signers: [''],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', { validators: Validators.maxLength(500), updateOn: 'blur' }],
        countryId: 0,
        postCode: ['', { validators: [Validators.minLength(5), Validators.maxLength(8)], updateOn: 'blur' }],
      }),
      contactDetails: this.fb.group({
        telephone: ['', { validators: [Validators.required, Validators.minLength(7), Validators.maxLength(16), Validators.pattern(/^\+?[ \d]+$/g)], updateOn: 'blur' }],
        fax: [''],
        email: ['', { validators: [Validators.required, Validators.pattern(AppConstants.emailPattern)], updateOn: 'blur' }],
        website: [''],
      })
    });
  }

  canDeactivate(): boolean {
    if (this.companyForm.dirty  && !this.isSubmitting) {
      return false;
    }
    return true;
  }
  cancel() {
    this.sharedService.back();
  }
}
