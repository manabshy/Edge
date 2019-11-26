import { Component, OnInit, ɵConsole } from '@angular/core';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ContactGroupsService } from '../contactgroups/shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { CompanyAutoCompleteResult } from '../contactgroups/shared/contact-group';
import { AppUtils } from '../core/shared/utils';
import { debounceTime, distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { SharedService } from '../core/services/shared.service';
import { Observable, EMPTY } from 'rxjs';
import * as _ from 'lodash';
import { CompanyService } from './shared/company.service';

const PAGE_SIZE = 10;
@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit {
  companyFinderForm: FormGroup;
  isHintVisible: boolean;
  companies: CompanyAutoCompleteResult[];
  isMessageVisible: boolean;
  advSearchCollapsed = false;
  suggestions: (text$: Observable<string>) => Observable<any[]>;
  suggestedTerm = '';
  searchTerm = '';
  page: number;
  bottomReached: boolean;

  constructor(private contactGroupService: ContactGroupsService,
    private companyService: CompanyService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.setTitle('Company Centre');
    this.companyFinderForm = this.fb.group({
      companyName: [''],
    });

    if (this.route.snapshot.queryParamMap.get('companyName') || AppUtils.companySearchTerm) {
      const term = this.route.snapshot.queryParamMap.get('companyName') || AppUtils.companySearchTerm;
      console.log('search term in company', term)
      this.companyFinderForm.get('companyName').setValue(term);
      this.companiesResults();
      this.isHintVisible = false;
      this.isMessageVisible = false;
    }
    this.companyService.companyPageChanges$.subscribe(newPageNumber => {
      if (newPageNumber) {
        this.page = newPageNumber;
        this.getNextCompanyListPage(this.page);
      }
    });

    this.suggestions = (text$: Observable<string>) =>
      text$
        .pipe(
          distinctUntilChanged(),
          switchMap(term => this.contactGroupService.getCompanySuggestions(term).pipe(catchError(() => {
            return EMPTY;
          }))));
  }

  companiesResults() {
    if (this.searchTerm) {
      this.suggestions = null;
    }
    this.page = 1;
    this.bottomReached = false;
    this.companies = [];
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.companyFinderForm.value.companyName;
    this.getNextCompanyListPage(this.page);
  }

  private getNextCompanyListPage(page: number) {
    this.contactGroupService.getAutocompleteCompany(this.searchTerm, PAGE_SIZE, page).subscribe(result => {
      if (this.searchTerm && this.searchTerm.length) {
        if (!result.length) {
          this.isMessageVisible = true;
          this.bottomReached = true;
          return;
        } else {
          this.isMessageVisible = false;
        }
      } else {
        this.isMessageVisible = false;
      }

      if (result) {
        this.companies = _.concat(this.companies, result);
      }

    }, error => {
      this.companies = [];
      this.searchTerm = '';
      this.isHintVisible = true;
    });
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
    AppUtils.companySearchTerm = this.companyFinderForm.value.companyName;

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
    AppUtils.companySearchTerm = this.searchTerm;
    this.suggestedTerm = '';
  }
}
