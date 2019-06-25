import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ContactGroupsService } from '../contactgroups/shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyAutoCompleteResult } from '../contactgroups/shared/contact-group';
import { AppUtils } from '../core/shared/utils';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companyFinderForm: FormGroup;
  isLoading: boolean;
  isHintVisible: boolean;
  companies: CompanyAutoCompleteResult[];
  isMessageVisible: boolean;
  advSearchCollapsed = false;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.companyFinderForm = this.fb.group({
      companyName: [''],
    });
    
    this.companyFinderForm.valueChanges.pipe(debounceTime(400)).subscribe(data => this.companiesAutocomplete(data));

    if (this.route.snapshot.queryParamMap.get('companyName') || AppUtils.companySearchTerm ) {
      this.companiesAutocomplete(this.route.snapshot.queryParamMap.get('companyName') || AppUtils.companySearchTerm );
    }
  }

  companiesAutocomplete(searchTerm: string) {
    console.log(searchTerm);
    this.isLoading = true;
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(result => {
        this.companies = result;
        this.isLoading = false;

        if (this.companyFinderForm.value.companyName && this.companyFinderForm.value.companyName.length) {
          if (!this.companies.length) {
            this.isMessageVisible = true;
          } else {
            this.isMessageVisible = false;
          }
        }

      }, error => {
        this.companies = [];
        this.isLoading = false;
        this.isHintVisible = true;
      });
  }

  onKeyup() {
    AppUtils.companySearchTerm = this.companyFinderForm.value;

    if (this.companyFinderForm.value.companyName && this.companyFinderForm.value.companyName.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.companies && !this.companies.length) {
        this.isHintVisible = true;
      }
    }
  }
}
