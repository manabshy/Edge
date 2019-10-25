import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ContactGroupsService } from '../contactgroups/shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyAutoCompleteResult } from '../contactgroups/shared/contact-group';
import { AppUtils } from '../core/shared/utils';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { SharedService } from '../core/services/shared.service';
import { Observable, EMPTY } from 'rxjs';

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
  suggestions: (text$: Observable<string>) => Observable<any[]>;
  suggestedTerm = '';
  searchTerm = '';

  constructor(private contactGroupService: ContactGroupsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.setTitle('Company Centre');
    this.companyFinderForm = this.fb.group({
      companyName: [''],
    });

    this.companyFinderForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => {
        console.log(data);
        // this.companiesAutocomplete(data)
      });

    if (this.route.snapshot.queryParamMap.get('companyName') || AppUtils.companySearchTerm) {
      const term = this.route.snapshot.queryParamMap.get('companyName') || AppUtils.companySearchTerm;
      this.companyFinderForm.get('companyName').setValue(term);
      this.companiesResults();
    }
    this.getSuggestions();
  }

  private getSuggestions() {
    this.suggestions = (text$: Observable<string>) =>
      text$
        .pipe(
          debounceTime(300),
          distinctUntilChanged(),
          switchMap(term => this.contactGroupService.getCompanySuggestions(term).pipe(catchError(() => {
            return EMPTY;
          }))), tap((data: any[]) => {
            if (data && !data.length) {
              this.isMessageVisible = true;
              this.isLoading = false;
              this.isHintVisible = false;
            }
          }));
  }

  companiesResults() {
    if (this.searchTerm) {
      this.isLoading = true;
    }
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.companyFinderForm.value.companyName;
    this.contactGroupService.getAutocompleteCompany(this.searchTerm).subscribe(result => {
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

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
    AppUtils.companySearchTerm = this.companyFinderForm.value;

    if (this.companyFinderForm.value.companyName && this.companyFinderForm.value.companyName.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.companies && !this.companies.length) {
        this.isHintVisible = true;
      }
    }
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.companiesResults();
    this.suggestedTerm = '';
  }
}
