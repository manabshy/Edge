import { Component, OnInit } from '@angular/core';
import { PropertyService } from './shared/property.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { distinctUntilChanged, takeUntil, tap, switchMap, catchError } from 'rxjs/operators';
import { PropertyAutoComplete } from './shared/property';
import { AppUtils } from '../core/shared/utils';
import { Observable, EMPTY } from 'rxjs';
import { BaseComponent } from '../core/models/base-component';
import * as _ from 'lodash';
import { SharedService } from '../core/services/shared.service';

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
  suggestions: (text$: Observable<string>) => Observable<unknown>;
  suggestedTerm: '';

  constructor(private propertyService: PropertyService,
    private fb: FormBuilder,
    private sharedService: SharedService) { super(); }

  ngOnInit() {
    this.sharedService.setTitle('Property Centre');
    this.propertyFinderForm = this.fb.group({
      searchTerm: [''],
    });

    if (AppUtils.propertySearchTerm) {
      this.propertyFinderForm.get('searchTerm').setValue(AppUtils.propertySearchTerm);
      this.propertiesResults();
      this.isHintVisible = false;
      this.isMessageVisible = false;
    }

    this.propertyService.propertyPageNumberChanges$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(newPageNumber => {
      this.page = newPageNumber;
      this.getNextPropertyPage(this.page);
    });

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.propertyService.getPropertySuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))
        )
      );

  }

  propertiesResults() {
    if (this.searchTerm) {
      this.isLoading = true;
      this.suggestions = null;
    }
    this.page = 1;
    this.bottomReached = false;
    this.properties = [];
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.propertyFinderForm.value.searchTerm;
    AppUtils.propertySearchTerm = this.searchTerm;
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
      this.searchTerm = '';
      this.isLoading = false;
      this.isHintVisible = true;
    });
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
    AppUtils.propertySearchTerm = this.propertyFinderForm.value.searchTerm;
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
      this.suggestedTerm = event.item;
    }
    this.propertiesResults();
    AppUtils.propertySearchTerm = this.searchTerm;
    this.suggestedTerm = '';
  }
}
