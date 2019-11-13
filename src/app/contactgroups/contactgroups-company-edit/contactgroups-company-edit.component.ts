import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { AppConstants } from 'src/app/core/shared/app-constants';

@Component({
  selector: 'app-contactgroups-company-edit',
  templateUrl: './contactgroups-company-edit.component.html',
  styleUrls: ['./contactgroups-company-edit.component.scss']
})
export class ContactgroupsCompanyEditComponent implements OnInit {
  companyForm: FormGroup;

  constructor(
              private contactGroupService: ContactGroupsService,
              private fb: FormBuilder,
              public sharedService: SharedService
            ) { }

  ngOnInit() {
    this.setupCompanyForm();

  }

  private setupCompanyForm() {
    this.companyForm = this.fb.group({
      companyName: [''],
      companyType: [''],
      signers: [''],
      fullAddress: [''],
      address: this.fb.group({
        addressLines: ['', { validators: Validators.maxLength(500)}],
        countryId: 0,
        postCode: ['', { validators: [Validators.minLength(5), Validators.maxLength(8)]}],
      }),
      contactDetails: this.fb.group({
        telephone: ['', { validators: [Validators.required, Validators.minLength(7), Validators.maxLength(16), Validators.pattern(/^\+?[ \d]+$/g)]}],
        fax: [''],
        email: ['', { validators: [Validators.required, Validators.pattern(AppConstants.emailPattern)]}],
        website: [''],
      })
    });
  }

  cancel() {
    this.sharedService.back();
  }

}
