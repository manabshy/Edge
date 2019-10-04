import { Component, OnInit } from '@angular/core';
import { PropertyService } from './shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { PropertyAutoComplete } from './shared/property';
import { AppUtils } from '../core/shared/utils';
import { Observable } from 'rxjs';
import { BaseComponent } from '../core/models/base-component';
import * as _ from 'lodash';

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
  bottomReached: boolean;

  constructor(private propertyService: PropertyService, private route: ActivatedRoute, private fb: FormBuilder) { super(); }

  ngOnInit() {
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

}
