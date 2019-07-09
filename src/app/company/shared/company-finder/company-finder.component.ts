import { Component, OnInit, OnChanges, Renderer2, ViewChild, ElementRef, Output, EventEmitter, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { BsModalService } from 'ngx-bootstrap/modal/public_api';
import { SharedService } from 'src/app/core/services/shared.service';
import { Company, CompanyAutoCompleteResult } from 'src/app/contactgroups/shared/contact-group';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-company-finder',
  templateUrl: './company-finder.component.html',
  styleUrls: ['./company-finder.component.scss']
})
export class CompanyFinderComponent implements OnInit {
  companyFinderForm: FormGroup;
  foundCompanies: CompanyAutoCompleteResult[];
  searchCompanyTermBK: any;
  //selectedCompanyDetails: Company;
  selectedCompanyId: number;
  isCompanyAdded: boolean;
  isLoadingCompaniesVisible: boolean;
  @Output() companyName = new EventEmitter<any>();
  @Output() selectedCompanyDetails = new EventEmitter<Company>();
  @Input() companyNameError: boolean = false;
  @Input() existingCompany: Company;
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
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    let companyName = '';
    switch(true) {
      case this.searchCompanyTermBK:
        companyName = this.searchCompanyTermBK.companyName;
        break;
      case !!this.existingCompany:
        companyName = this.existingCompany.companyName;
        break;
      default:
        companyName = '';
    }
    this.companyFinderForm = this.fb.group({
      companyName: [companyName, Validators.required],
    });
    this.companyFinderForm.valueChanges.pipe(debounceTime(400)).subscribe(data => this.findCompany(data));
  }

  initCompanySearch() {
    this.isCompanyAdded = false;
    if (this.companyFinderForm.get('companyName').value && this.searchCompanyTermBK) {
      this.companyFinderForm.get('companyName').setValue(this.searchCompanyTermBK.companyName);
    }
  }

  selectCompany(company: Company) {
    this.isCompanyAdded = true;
    this.selectedCompanyDetails.emit(company);
  }

  findCompany(searchTerm: any) {
    this.isLoadingCompaniesVisible = true;
    this.companyName.emit(searchTerm);
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(data => {
      this.foundCompanies = data;
      this.searchCompanyTermBK = searchTerm;
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
