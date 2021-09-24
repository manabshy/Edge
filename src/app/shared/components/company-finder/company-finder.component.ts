import { Component, OnInit, OnChanges, Renderer2, ViewChild, ElementRef, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName, FormControl } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { Company, CompanyAutoCompleteResult } from 'src/app/contactgroups/shared/contact-group';
import { debounceTime, distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-company-finder',
  templateUrl: './company-finder.component.html',
  styleUrls: ['./company-finder.component.scss']
})
export class CompanyFinderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() companyNameError = false;
  @Input() existingCompany?: Company;
  @Input() canCreateNewCompany = false;
  @Output() companyName = new EventEmitter<any>();
  @Output() selectedCompanyDetails = new EventEmitter<Company>();
  @Output() isManualEntry = new EventEmitter<boolean>();
  companyFinderForm: FormGroup;
  foundCompanies: CompanyAutoCompleteResult[];
  selectedCompany: Company;
  selectedCompanyId: number;
  isCompanyAdded: boolean;
  enterManually = false;
  @ViewChild('companyNameInput', { static: true }) companyNameInput: ElementRef;
  suggestions: (text$: Observable<string>) => Observable<any[]>;
  noSuggestions = false;
  suggestedTerm: '';
  searchTerm = '';
  hasBeenSearched = false;

  get companyNameControl(): FormControl {
    return this.companyFinderForm.get('companyName') as FormControl;
  }
  constructor(
    private contactGroupService: ContactGroupsService,
    private fb: FormBuilder,
    // private router: Router
  ) { }

  ngOnInit() {
    this.init();
    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.contactGroupService.getCompanySuggestions(term).pipe(
            tap(data => {
              if (data && !data.length) {
                this.noSuggestions = true;
              } else {
                this.noSuggestions = false;
              }
            }),
            catchError(() => {
              return EMPTY;
            }))
        )
      );
  }

  ngOnChanges() {
    this.init();
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.searchCompany();
    this.suggestedTerm = '';
  }

  init() {
    let companyName = '';
    switch (true) {
      case !!this.selectedCompany:
        companyName = this.selectedCompany.companyName;
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

    this.companyFinderForm.valueChanges.pipe(debounceTime(500)).subscribe(data => {
      this.selectedCompany = data;
      // this.companyName.emit(this.selectedCompany.companyName);
    });
  }

  enterCompany() {
    event.preventDefault();
    event.stopPropagation();
    this.foundCompanies = null;
    const searchTerm = this.companyFinderForm.get('companyName').value;
    this.companyFinderForm.get('selectedCompany').setValue(searchTerm);
    this.enterManually = true;
    // this.enterManually = !this.enterManually;
  }

  selectCompany(company: Company) {
    this.isCompanyAdded = true;
    this.foundCompanies = null;
    this.hasBeenSearched = false;
    this.selectedCompanyDetails.emit(company);
  }

  searchCompany() {
    event.preventDefault();
    event.stopPropagation();
    this.enterManually = false;
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.companyFinderForm.value.companyName;
    console.log('company name', this.searchTerm);
    this.findCompany(this.searchTerm);
  }

  findCompany(searchTerm: any) {
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe(data => {
      this.hasBeenSearched = true;
      this.foundCompanies = data;
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

  enterDetailsManually(isNewCompany?: boolean) {
    console.log({ isNewCompany });

    // if (isNewCompany) {
    //   this.router.navigate(['/company-centre/detail', 0, 'edit'],
    //     { queryParams: { isNewCompany: true, backToOrigin: true, companyName: this.companyNameControl?.value } });
    // } else {
      console.log(this.companyNameControl.value);
      this.isManualEntry.emit();
      this.companyName.emit(this.companyNameControl.value);
    // }
  }

  ngOnDestroy() {
    console.log('destroyed');

  }
}
