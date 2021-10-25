import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Company, CompanyAutoCompleteResult } from 'src/app/contact-groups/shared/contact-group';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

// The pure component is neat and tidy with minimal code and dependencies. This makes it easier to develop alongside Storybook.

@Component({
  selector: 'app-pure-company-finder-shell',
  templateUrl: './pure-company-finder-shell.component.html',
})
export class PureCompanyFinderShellComponent implements OnInit {
  @Input() searchResults: CompanyAutoCompleteResult[];
  @Input() existingCompany?: Company;
  @Input() companyNameError: String;
  @Input() canCreateNewCompany: Boolean;
  @Input() hasBeenSearched: Boolean;
  @Input() noSuggestions: Boolean;
  @Input() suggestions: any;

  @Output() isManualEntry = new EventEmitter<object>();
  @Output() createNew = new EventEmitter<boolean>();
  @Output() searchCompanyEmitter = new EventEmitter<any>();
  @Output() selectedCompanyDetails = new EventEmitter<any>();
  @Output() companyName = new EventEmitter<any>();

  isCompanyAdded: boolean;
  enterManually = false;
  selectedCompany: Company;
  companyFinderForm: FormGroup;
  suggestedTerm: '';
  searchTerm = '';

  @ViewChild('companyNameInput', { static: true }) companyNameInput: ElementRef;

  get companyNameControl(): FormControl {
    return this.companyFinderForm.get('companyName') as FormControl;
  }

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    console.log('pure-company-finder-shell onInit');

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

    this.companyFinderForm.valueChanges.pipe(debounceTime(500)).subscribe((data) => {
      this.selectedCompany = data;
    });
  }

  // enterCompany() {
  //   this.searchResults = null
  //   const searchTerm = this.companyFinderForm.get('companyName').value
  //   this.companyFinderForm.get('selectedCompany').setValue(searchTerm)
  //   this.enterManually = true
  // }

  selectCompany(company: Company) {
    this.isCompanyAdded = true;
    this.searchResults = null;
    this.hasBeenSearched = false;
    this.selectedCompanyDetails.emit(company);
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.searchCompany();
    this.suggestedTerm = '';
  }

  searchCompany(ev?) {
    ev?.preventDefault();
    ev?.stopPropagation();
    this.enterManually = false;
    this.suggestedTerm
      ? (this.searchTerm = this.suggestedTerm)
      : (this.searchTerm = this.companyFinderForm.value.companyName);
    this.searchCompanyEmitter.emit(this.searchTerm);
  }

  enterDetailsManually(isNewCompany?: boolean) {
    console.log({ isNewCompany });
    console.log(this.companyNameControl.value);
    this.isManualEntry.emit({ isNewCompany, companyName: this.companyNameControl.value });
  }
}
