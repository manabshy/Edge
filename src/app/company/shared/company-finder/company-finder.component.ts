import { Component, OnInit, OnChanges, Renderer2, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { Company, CompanyAutoCompleteResult } from 'src/app/contactgroups/shared/contact-group';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-company-finder',
  templateUrl: './company-finder.component.html',
  styleUrls: ['./company-finder.component.scss']
})
export class CompanyFinderComponent implements OnInit, OnChanges {
  companyFinderForm: FormGroup;
  foundCompanies: CompanyAutoCompleteResult[];
  selectedCompany: any;
  selectedCompanyId: number;
  isCompanyAdded: boolean;
  isLoadingCompaniesVisible: boolean;
  enterManually: boolean = false;
  @Output() companyName = new EventEmitter<any>();
  @Output() selectedCompanyDetails = new EventEmitter<Company>();
  @Input() companyNameError = false;
  @Input() existingCompany: Company;
  @ViewChild('companyNameInput', { static: true }) companyNameInput: ElementRef;

  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private sharedService: SharedService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    let companyName = '';
    switch (true) {
      case this.selectedCompany:
        companyName = this.selectedCompany.selectedCompany;
        break;
      case !!this.existingCompany:
        companyName = this.existingCompany.companyName;
        break;
      default:
        companyName = '';
    }
    this.companyFinderForm = this.fb.group({
      companyName: [''],
      selectedCompany: [companyName, Validators.required],
    });
    this.companyFinderForm.valueChanges.subscribe(data => {
      this.selectedCompany = data;
      this.companyName.emit(this.selectedCompany);
    });
  }

  enterCompany() {
    event.preventDefault();
    event.stopPropagation();
    this.foundCompanies = null;
    const searchTerm = this.companyFinderForm.get('companyName').value;
    this.companyFinderForm.get('selectedCompany').setValue(searchTerm);
    this.enterManually = !this.enterManually;
  }

  selectCompany(company: Company) {
    this.isCompanyAdded = true;
    this.foundCompanies = null;
    this.selectedCompanyDetails.emit(company);
  }

  searchCompany() {
    event.preventDefault();
    event.stopPropagation();
    this.enterManually = false;
    const searchTerm = this.companyFinderForm.value.companyName;
    console.log('company name', searchTerm);
    this.findCompany(searchTerm);
  }

  findCompany(searchTerm: any) {
    this.isLoadingCompaniesVisible = true;
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(data => {
      this.foundCompanies = data;
      this.isLoadingCompaniesVisible = false;
      this.checkDuplicateCompanies(searchTerm);
    });
  }

  checkDuplicateCompanies(companyName: string) {
    const matchedCompanies = [];
    if (this.foundCompanies && companyName.length) {
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
