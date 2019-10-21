import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from '../core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from '../core/services/shared.service';
import { AppConstants } from '../core/shared/app-constants';
import { InfoService } from '../core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
import { PeopleService } from '../core/services/people.service';

const PAGE_SIZE = 20;
@Component({
  selector: 'app-contactgroups',
  templateUrl: './contactgroups.component.html',
  styleUrls: ['./contactgroups.component.scss']
})
export class ContactGroupsComponent implements OnInit {
  advSearchCollapsed = false;
  isMessageVisible = false;
  isHintVisible = false;
  isLoading = false;
  contactFinderForm: FormGroup;
  contactGroups: ContactGroupAutoCompleteResult[] = [];
  contactGroupDetails: ContactGroupAutoCompleteResult[];
  contactPeople: any[];
  contactGroupId: number;
  listInfo: any;
  warnings: any;
  differentSearchSuggestions: string[];
  page = 1;
  searchTerm = '';
  bottomReached = false;
  search: (text$: Observable<string>) => Observable<any>;
  searching: boolean;
  searchFailed: boolean;

  constructor(private contactGroupService: ContactGroupsService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private infoService: InfoService,
    private peopleService: PeopleService,
    private storage: StorageMap,
    private sharedService: SharedService) { }

  ngOnInit() {
    this.sharedService.setTitle('Contact Centre');
    this.contactFinderForm = this.fb.group({
      searchTerm: [''],
    });

    this.route.queryParams.subscribe(params => {
      if (params['searchTerm'] || AppUtils.searchTerm) {
        this.contactFinderForm.get('searchTerm').setValue(params['searchTerm'] || AppUtils.searchTerm);
        this.contactGroupsResults();
        this.isHintVisible = false;
        this.isMessageVisible = false;
      }
    });

    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.setDropdownLists();
        console.log('list info in contact groups....', this.listInfo);
      }
    });

    // page changes here
    this.contactGroupService.pageChanges$.subscribe(newPageNumber => {
      if (newPageNumber) {
        this.page = newPageNumber;
        this.getNextContactGroupsPage(this.page);
      }
    });
    
    // suggestions
    this.search = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      tap(() => this.searching = true),
      switchMap(term =>
        this.peopleService.getPeopleSuggestions(term).pipe(
          tap(() => this.searchFailed = false),
          catchError(() => {
            this.searchFailed = true;
            return of([]);
          }))
      ),
      tap(() => this.searching = false)
    )
  }

  ngOnDestroy() {
    this.contactGroups = [];
  }
  setDropdownLists() {
    if (this.listInfo) {
      this.warnings = this.listInfo.personWarningStatuses;
    }
  }

  contactGroupsResults() {
    if (this.searchTerm) {
      this.isLoading = true;
    }
    this.page = 1;
    this.bottomReached = false;
    this.contactGroups = [];
    this.searchTerm = this.contactFinderForm.get('searchTerm').value;
    this.getNextContactGroupsPage(this.page);
  }

  getNextContactGroupsPage(page: number) {
    this.isLoading = true;
    this.contactGroupService.getAutocompleteContactGroups(this.searchTerm, PAGE_SIZE, page).subscribe(result => {
      this.isLoading = false;

      if (this.searchTerm && this.searchTerm.length) {
        if (!result.length) {
          this.isMessageVisible = true;
          this.bottomReached = true;
          this.getDifferentSearchSuggestions(this.searchTerm);
          return;
        } else {
          this.isMessageVisible = false;
        }
      } else {
        this.isMessageVisible = false;
      }

      if (result) {
        this.contactGroups = _.concat(this.contactGroups, result);
        if (this.contactGroups && this.contactGroups.length) {
          this.contactGroups.forEach(x => {
            x.warning = this.sharedService.showWarning(x.warningStatusId, this.warnings, x.warningStatusComment);
          });
        }
      }

    }, error => {
      this.contactGroups = [];
      this.isLoading = false;
      this.isHintVisible = true;
    });
  }

  getDifferentSearchSuggestions(searchTerm: string) {
    const telIndex = searchTerm.search(AppConstants.telephonePattern);
    this.differentSearchSuggestions = [];
    if (telIndex > 0) {
      this.differentSearchSuggestions.push(searchTerm.substring(0, telIndex).trim());
    }
    this.differentSearchSuggestions.push(searchTerm.substring(telIndex).trim());
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
    AppUtils.searchTerm = this.contactFinderForm.value.searchTerm;

    if (this.contactFinderForm.value.searchTerm && this.contactFinderForm.value.searchTerm.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.contactGroups && !this.contactGroups.length) {
        this.isHintVisible = true;
      }
    }
  }

  selectedSuggestion(event: any){
    if (event.item != null) {
      this.searchTerm = event.item;
      this.isMessageVisible = false;
      console.log('search term', this.searchTerm)
      console.log('item selected', event)
     }
      this.contactGroupsResults();
  }
}

export const states = ['Alabama', 'Alaska', 'American Samoa', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'District Of Columbia', 'Federated States Of Micronesia', 'Florida', 'Georgia',
  'Guam', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
  'Marshall Islands', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Northern Mariana Islands', 'Ohio', 'Oklahoma', 'Oregon', 'Palau', 'Pennsylvania', 'Puerto Rico', 'Rhode Island',
  'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virgin Islands', 'Virginia',
  'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'];
