import { Component, OnInit, Renderer2, ViewChild, ElementRef, Input } from '@angular/core';
import { ContactGroupsService } from '../contact-groups.service';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { SharedService } from 'src/app/core/services/shared.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { ToastrService } from 'ngx-toastr';
import { Company, CompanyAutoCompleteResult, ContactGroup } from '../contact-group';
import { Observable, EMPTY } from 'rxjs';
import { distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-contactgroups-company-finder',
  templateUrl: './contactgroups-company-finder.component.html',
  styleUrls: ['./contactgroups-company-finder.component.scss']
})
export class ContactgroupsCompanyFinderComponent implements OnInit {
  @Input() contactGroupDetails: ContactGroup;
  companyFinderForm: FormGroup;
  selectedCompany = '';
  selectedCompanyDetails: Company;
  selectedCompanyId: number;
  foundCompanies: CompanyAutoCompleteResult[];
  isCompanyAdded = true;
  suggestions: (text$: Observable<string>) => Observable<any[]>;
  suggestedTerm = '';
  searchTerm = '';
  noSuggestions = false;
  isExistingCompany = false;
  existingCompanyId: number;
  existingCompanyDetails: Company;
  isSearchCompanyVisible: boolean;
  @ViewChild('selectedCompanyInput', { static: false }) selectedCompanyInput: ElementRef;
  @ViewChild('companyNameInput', { static: false }) companyNameInput: ElementRef;
  isEditingSelectedCompany: boolean;

  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService,
    private storage: StorageMap,
    private toastr: ToastrService,
    private renderer: Renderer2
  ) { }

  ngOnInit() {
    this.companyFinderForm = this.fb.group({
      companyName: [''],
      selectedCompany: ['', Validators.required],
    });

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.contactGroupService.getCompanySuggestions(term).pipe(
            tap(data => {
              if (data && !data.length) {
                this.noSuggestions = true;
              }
            }),
            catchError(() => {
              return EMPTY;
            }))
        )
      );
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.searchCompany();
    this.suggestedTerm = '';
  }

  searchCompany() {
    event.preventDefault();
    event.stopPropagation();
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.companyFinderForm.value.companyName;
    this.findCompany(this.searchTerm);
  }

  findCompany(searchTerm: any) {
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(data => {
      this.foundCompanies = data;
    });
  }

  selectCompany(company: Company) {
    this.foundCompanies = null;
    this.selectedCompanyDetails = company;
    this.isCompanyAdded = true;
    this.companyFinderForm.get('selectedCompany').setValue(company.companyName);
    this.selectedCompany = this.companyFinderForm.get('selectedCompany').value;
    this.isSearchCompanyVisible = false;
    setTimeout(() => {
      if (this.selectedCompanyInput) {
        this.selectedCompanyInput.nativeElement.scrollIntoView({ block: 'center' });
      }
    });
  }

  getCompanyDetails(companyId: number) {
    this.contactGroupService.getCompany(companyId).subscribe(data => {
      this.selectedCompanyDetails = data;
      this.isSearchCompanyVisible = false;
    });
  }

  editSelectedCompany(id: number, newCompany?: boolean) {
    event.preventDefault();
    this.isEditingSelectedCompany = true;
    AppUtils.holdingSelectedCompany = this.selectedCompanyDetails;
    AppUtils.holdingContactType = this.contactGroupDetails.contactType;
    let companyName;
    if (newCompany) {
      companyName = this.companyFinderForm.get('selectedCompany').value;
    }
    this._router.navigate(['/company-centre/detail', id, 'edit'],
      { queryParams: { isNewCompany: newCompany, isEditingSelectedCompany: true, companyName: companyName } });
  }

  toggleSearchCompany() {
    event.preventDefault();
    this.isSearchCompanyVisible = !this.isSearchCompanyVisible;
    setTimeout(() => {
      this.companyNameInput.nativeElement.focus();
    });
  }
}
