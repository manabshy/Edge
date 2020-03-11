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
import { Observable, of, EMPTY } from 'rxjs';
import { distinctUntilChanged, tap, switchMap, catchError } from 'rxjs/operators';
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
  suggestions: (text$: Observable<string>) => Observable<any>;
  searching: boolean;
  searchFailed: boolean;
  suggestedTerm: any;

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

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.peopleService.getPeopleSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))
        )
      );
  }

  setDropdownLists() {
    if (this.listInfo) {
      this.warnings = this.listInfo.personWarningStatuses;
    }
  }

  contactGroupsResults(submit?: boolean) {
    if (this.searchTerm) {
      this.suggestions = null;
    }
    this.page = 1;
    this.bottomReached = false;
    this.contactGroups = [];
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.contactFinderForm.get('searchTerm').value;
    this.getNextContactGroupsPage(this.page);
    if (submit) {
      this.sharedService.scrollElIntoView('list-group');
    }
  }

  getNextContactGroupsPage(page: number) {
    this.contactGroupService.getAutocompleteContactGroups(this.searchTerm, PAGE_SIZE, page).subscribe(result => {

      if (this.searchTerm && this.searchTerm.length) {
        if (result && !result.length) {
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
        if (page === 1) {
          this.contactGroups = result;
        } else {
          this.contactGroups = _.concat(this.contactGroups, result);
        }
        if (this.contactGroups && this.contactGroups.length) {
          this.contactGroups.forEach(x => {
            x.warning = this.sharedService.showWarning(x.warningStatusId, this.warnings, x.warningStatusComment);
          });
        }
      }

    }, error => {
      this.contactGroups = [];
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

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.contactGroupsResults(true);
    this.suggestedTerm = '';
  }
}
