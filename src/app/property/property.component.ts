import { Component, OnInit } from '@angular/core';
import { PropertyService } from './shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil, tap, switchMap, catchError } from 'rxjs/operators';
import { PropertyAutoComplete } from './shared/property';
import { AppUtils } from '../core/shared/utils';
import { Observable, of } from 'rxjs';
import { BaseComponent } from '../core/models/base-component';
import * as _ from 'lodash';
import { SharedService } from '../core/services/shared.service';
import { states } from '../contactgroups/contactgroups.component';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent extends BaseComponent implements OnInit {
  propertyFinderForm: FormGroup;
  isLoading: boolean;
  properties: PropertyAutoComplete[] = [];
  isMessageVisible: boolean;
  isHintVisible: boolean;
  advSearchCollapsed = false;
  searchTerm = '';
  PAGE_SIZE = 20;
  page: number;
  bottomReached = false;
  search: (text$: Observable<string>) => Observable<unknown>;
  searching: boolean;
  searchFailed: boolean;

  constructor(private propertyService: PropertyService,
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private sharedService: SharedService) { super(); }

  ngOnInit() {
    this.sharedService.setTitle('Property Centre');
    this.propertyFinderForm = this.fb.group({
      searchTerm: [''],
    });

    // this.route.queryParams.subscribe(params => {
    //   if (params['searchTerm'] || AppUtils.searchTerm) {
    //     this.propertyFinderForm.get('searchTerm').setValue(params['searchTerm'] || AppUtils.propertySearchTerm);
    //     this.propertiesResults();
    //     this.isHintVisible = false;
    //     this.isMessageVisible = false;
    //   }
    // });
    // if (this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.propertySearchTerm ) {
    //   this.propertiesResults();
    // }

    this.propertyService.propertyPageNumberChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newPageNumber => {
      this.page = newPageNumber;
      this.getNextPropertyPage(this.page);
    });
    // suggestions
    this.search = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(300),
        distinctUntilChanged(),
        tap(() => this.searching = true),
        switchMap(term =>
          this.propertyService.getPropertySuggestions(term).pipe(
            tap(() => this.searchFailed = false),
            catchError(() => {
              this.searchFailed = true;
              return of([]);
            }))
        ),
        tap(() => this.searching = false)
      );

  }

  propertiesResults() {
    if (this.searchTerm) {
      this.isLoading = true;
    }
    this.page = 1;
    this.bottomReached = false;
    this.properties = [];
    this.searchTerm = this.propertyFinderForm.value.searchTerm;
    this.getNextPropertyPage(this.page);
  }

  getNextPropertyPage(page) {
    this.isLoading = true;
    this.propertyService.autocompleteProperties(this.searchTerm, this.PAGE_SIZE, page).subscribe(result => {
      this.isLoading = false;
      if (this.searchTerm && this.searchTerm.length) {
        if (!result.length) {
          this.isMessageVisible = true;
          this.bottomReached = true;
        } else {
          this.isMessageVisible = false;
        }
      }
      if (result) {
        this.properties = _.concat(this.properties, result);
      }

    }, error => {
      this.properties = [];
      this.isLoading = false;
      this.isHintVisible = true;
    });
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
    AppUtils.propertySearchTerm = this.propertyFinderForm.value;
    if (this.propertyFinderForm.value.searchTerm && this.propertyFinderForm.value.searchTerm.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.properties && !this.properties.length) {
        this.isHintVisible = true;
      }
    }
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.searchTerm = event.item;
      this.isMessageVisible = false;
      console.log('search term', this.searchTerm);
      console.log('item selected', event);
    }
    this.propertiesResults();
  }
}
