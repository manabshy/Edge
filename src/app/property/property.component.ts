import { Component, OnInit } from '@angular/core';
import { PropertyService } from './shared/property.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { PropertyAutoComplete } from './shared/property';
import { AppUtils } from '../core/shared/utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.scss']
})
export class PropertyComponent implements OnInit {
  propertyFinderForm: FormGroup;
  isLoading: boolean;
  properties: PropertyAutoComplete[];
  isMessageVisible: boolean;
  isHintVisible: boolean;
  advSearchCollapsed = false;
  // properties$ = new Observable<PropertyAutoComplete[]>();

  constructor(private propertyService: PropertyService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.propertyFinderForm = this.fb.group({
      propertyAddress: [''],
    });
    this.propertyFinderForm.valueChanges
      .pipe(debounceTime(1000),
        distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => {
        if (data.propertyAddress) {
          //this.propertiesAutocomplete(data);
          // this.properties$ = this.propertyService.autocompleteProperties(data);
        }
      });
    if (this.route.snapshot.queryParamMap.get('propertyAddress') || AppUtils.propertySearchTerm ) {
      this.propertiesResults(this.route.snapshot.queryParamMap.get('propertyAddress') || AppUtils.propertySearchTerm || '');
    }

  }
  // propertiesAutocomplete(searchTerm: string) {
  //   this.isLoading = true;
  //   this.propertyService.autocompleteProperties(searchTerm).subscribe(result => {
  //     this.properties = result;
  //     this.isLoading = false;
  //     if (this.propertyFinderForm.value.propertyAddress && this.propertyFinderForm.value.propertyAddress.length) {
  //       if (!this.properties.length) {
  //         this.isMessageVisible = true;
  //       } else {
  //         this.isMessageVisible = false;
  //       }
  //     }
  //   }, error => {
  //     this.properties = [];
  //     this.isLoading = false;
  //     this.isHintVisible = true;
  //   });
  // }

  propertiesResults(searchTerm: any) {
    if(!searchTerm) {
      searchTerm = this.propertyFinderForm.value;
    }
    this.isLoading = true;
    this.propertyService.autocompleteProperties(searchTerm).subscribe(result => {
      this.properties = result;
      this.isLoading = false;
      if (this.propertyFinderForm.value.propertyAddress && this.propertyFinderForm.value.propertyAddress.length) {
        if (!this.properties.length) {
          this.isMessageVisible = true;
        } else {
          this.isMessageVisible = false;
        }
      }
    }, error => {
      this.properties = [];
      this.isLoading = false;
      this.isHintVisible = true;
    });
  }

  onKeyup() {
    if(event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
    AppUtils.propertySearchTerm = this.propertyFinderForm.value;
    if (this.propertyFinderForm.value.propertyAddress && this.propertyFinderForm.value.propertyAddress.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.properties && !this.properties.length) {
        this.isHintVisible = true;
      }
    }
  }
}
