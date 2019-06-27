import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { AppConstants, FormErrors, ValidationMessages } from 'src/app/core/shared/app-constants';
import { ActivatedRoute } from '@angular/router';
import { Company, ContactGroup, Signer } from 'src/app/contactgroups/shared/contact-group';
import { CompanyService } from '../shared/company.service';
import { debounceTime } from 'rxjs/operators';

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
  address: any;
  companyId: number;
  isNewCompany: boolean;
  companyDetails: Company;
  existingSigner: Signer;
  signer: Signer;
  errorMessage: WedgeError;
  defaultCountryCode = 232;
  formErrors = FormErrors;
  // get signer(): FormControl {
  //   return <FormControl> this.companyForm.get('signer');
  // }
  constructor(private contactGroupService: ContactGroupsService,
              private companyService: CompanyService,
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
    this.companyForm.valueChanges.pipe(debounceTime(400)).subscribe(data => this.logValidationErrors(this.companyForm, false));
  }
  getCompanyDetails(id: number) {
    this.contactGroupService.getCompany(id).subscribe(data => {
      this.companyDetails = data;
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
      companyTypeId: company.companyTypeId,
      address: {
        postCode: company.companyAddress.postCode,
        countryId: company.companyAddress.countryId,
        country: company.companyAddress.country,
      },
        telephone: company.telephone,
        fax: company.fax,
        website: company.website,
        email: company.email
    });
     this.existingSigner = company.signer;
  }
  populateNewCompanyDetails() {
    if (this.companyForm) {
      this.companyForm.reset();
    }
    this.companyForm.patchValue({
      companyTypeId: this.companyDetails.companyTypeId,
      signer: this.companyDetails.signer,
      address: {
        postCode: this.companyDetails.companyAddress.postCode,
        countryId: this.defaultCountryCode,
        country: this.companyDetails.companyAddress.country,
      },
        telephone: this.companyDetails.telephone,
        fax: this.companyDetails.fax,
        website: this.companyDetails.website,
        email: this.companyDetails.email,
    });
  }

  private setupCompanyForm() {
    this.companyForm = this.fb.group({
      companyName: [''],
      companyTypeId: 0,
      signer: [''],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', { validators: Validators.maxLength(500), updateOn: 'blur' }],
        countryId: 0,
        postCode: ['', { validators: [Validators.minLength(5), Validators.maxLength(8)], updateOn: 'blur' }],
      }),
        telephone: ['', { validators: [Validators.minLength(7),
                          Validators.maxLength(16), Validators.pattern(/^\+?[ \d]+$/g)], updateOn: 'blur' }],
        fax: ['', { validators: [Validators.minLength(7), Validators.maxLength(16), Validators.pattern(/^\+?[ \d]+$/g)], updateOn: 'blur' }],
        email: ['', { validators: [Validators.pattern(AppConstants.emailPattern)], updateOn: 'blur' }],
        website: [''],
    });
  }

  logValidationErrors(group: FormGroup = this.companyForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
       FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = '';
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }
    });
  }
  getSelectedSigner(signer: any) {
    this.signer = signer;
    console.log('signers', this.signer);
    console.log('signer from signer component', signer);
  }

  getAddress(address: any) {
    this.address = address;
    console.log('address from address component', address);
  }
  saveCompany() {
    if (this.companyForm.valid) {
      if (this.companyForm.dirty) {
        this.AddOrUpdateCompany();
      } else {
        this.onSaveComplete();
      }
    } else {
      this.errorMessage.displayMessage = 'Please correct validation errors';
    }
  }
  private AddOrUpdateCompany() {
    let companySigner;
    let companyAddress;
    console.log('company details before update...', this.companyDetails);
    const company = { ...this.companyDetails, ...this.companyForm.value };
    if (this.companyDetails) {
      companyAddress = { ...this.companyDetails.companyAddress, ...this.address };
      companySigner = { ...this.companyDetails.signer, ...this.signer };
      company.signer = companySigner;
      company.companyAddress = companyAddress;
    } else {
      company.signer = this.signer;
      company.companyAddress = this.address;
    }
    if (this.isNewCompany) {
      console.log('add company', company);
      this.companyService.addCompany(company).subscribe(() => this.onSaveComplete(), (error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        this.isSubmitting = false;
      });
    } else {
      console.log('company address from component...', this.address);
      console.log('company address to update here...', companyAddress);
      console.log('update company here...', company);
      this.companyService.updateCompany(company).subscribe(() => this.onSaveComplete(), (error: WedgeError) => {
        this.errorMessage = error;
        this.sharedService.showError(this.errorMessage);
        this.isSubmitting = false;
      });
    }
  }
  onSaveComplete() {
   console.log('complete');
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
