import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { BsModalService } from 'ngx-bootstrap/modal/public_api';
import { SharedService } from 'src/app/core/services/shared.service';
import { Company, CompanyAutoCompleteResult } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-company-finder',
  templateUrl: './company-finder.component.html',
  styleUrls: ['./company-finder.component.scss']
})
export class CompanyFinderComponent implements OnInit {
  companyFinderForm: FormGroup;
  foundCompanies: CompanyAutoCompleteResult[];
  searchCompanyTermBK = '';
  selectedCompanyDetails: Company;
  selectedCompanyId: number;
  isCompanyAdded: boolean;
  isLoadingCompaniesVisible: boolean;
  @ViewChild('companyNameInput') companyNameInput: ElementRef;

  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    // private modalService: BsModalService,
    // private _location: Location,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.companyFinderForm = this.fb.group({
      companyName: ['', Validators.required],
    });
    this.companyFinderForm.valueChanges.subscribe(data => this.findCompany(data));
  }

  initCompanySearch() {
    this.selectedCompanyDetails = null;
    this.isCompanyAdded = false;
    if (this.companyFinderForm.get('companyName').value) {
      this.companyFinderForm.get('companyName').setValue(this.searchCompanyTermBK);
    }
  }

  selectCompany(company: Company) {
    this.foundCompanies = null;
    this.selectedCompanyDetails = company;
    this.isCompanyAdded = true;
    this.searchCompanyTermBK = this.companyFinderForm.get('companyName').value;
    this.companyFinderForm.get('companyName').setValue(company.companyName);
    this.companyNameInput.nativeElement.scrollIntoView({ block: 'center' });
  }

  findCompany(searchTerm: string) {
    this.isLoadingCompaniesVisible = true;
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(data => {
      this.foundCompanies = data;
      this.isLoadingCompaniesVisible = false;
      this.checkDuplicateCompanies(searchTerm);
    });
  }

  getCompanyDetails(companyId: number) {
    this.contactGroupService.getCompany(companyId).subscribe(data => {
      this.selectedCompanyDetails = data;
    });
  }
  checkDuplicateCompanies(companyName) {
    const matchedCompanies = [];
    if (this.foundCompanies) {
      this.foundCompanies.forEach((x) => {
        const sameCompanyName = x.companyName.toLowerCase() === companyName.toLowerCase();
        if (sameCompanyName) {
          x.matchScore = 10;
        }
        matchedCompanies.push(x);
      });
      this.foundCompanies = matchedCompanies;
    }
  }
}
