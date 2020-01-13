import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyService } from 'src/app/property/shared/property.service';
import { Observable, EMPTY } from 'rxjs';
import { distinctUntilChanged, switchMap, catchError, tap } from 'rxjs/operators';
import { Property, PropertyAutoComplete } from 'src/app/property/shared/property';
import { RequestOption } from 'src/app/core/shared/utils';
import { BaseProperty } from '../models/base-property';

@Component({
  selector: 'app-property-finder',
  templateUrl: './property-finder.component.html',
  styleUrls: ['./property-finder.component.css']
})
export class PropertyFinderComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() readOnly = false;
  @Input() existingProperty: Property;
  @Output() selectedProperty = new EventEmitter<any>();
  @ViewChild('selectedPropertyInput', { static: true }) selectedPropertyInput: ElementRef;
  @ViewChild('searchPropertyInput', { static: true }) searchPropertyInput: ElementRef;
  properties: PropertyAutoComplete[];
  selectedPropertyDetails: Property;
  propertyFinderForm: FormGroup;
  searchTerm = '';
  PAGE_SIZE = 20;
  suggestedTerm = '';
  isMessageVisible: boolean;
  isHintVisible: boolean;
  isSearchVisible = true;
  noSuggestions = false;
  createdProperty: Property;
  suggestions: (text$: Observable<string>) => Observable<unknown>;


  constructor(private propertyService: PropertyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.propertyFinderForm = this.fb.group({
      searchTerm: [''],
      selectedPropertyAddress: [''],
    });

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.propertyService.getPropertySuggestions(term).pipe(
            tap(data => {
              if (data && !data.length) {
                this.noSuggestions = true;
              }
            }),
            catchError(() => {
              return EMPTY;
            }))
        )
      );
    this.displayExistingProperty();
  }

  ngOnChanges() {
    this.displayExistingProperty();
  }

  searchProperty() {
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.propertyFinderForm.value.searchTerm;
    const requestOptions = {
      pageSize: this.PAGE_SIZE,
      searchTerm: this.searchTerm
    } as RequestOption;
    this.propertyService.autocompleteProperties(requestOptions).subscribe(result => {
      this.properties = result;
    }, error => {
      this.properties = [];
      this.searchTerm = '';
    });
  }

  selectProperty(propertyId: number) {
    this.isSearchVisible = false;
    this.existingProperty = null;
    if (propertyId) {
      this.propertyService.getProperty(propertyId, true, true).subscribe(data => {
        if (data) {
          console.log('selected prop', data);
          this.selectedPropertyDetails = data;
          this.propertyFinderForm.get('selectedPropertyAddress').patchValue(data.address);
          this.selectedProperty.emit(data);
          // setTimeout(() => {
          //   this.selectedPropertyInput.nativeElement.scrollIntoView({ block: 'center' });
          // });
        }
      });
    }
  }

  displayExistingProperty() {
    // let property: Property;
    // property = this.existingProperty;
    if (this.existingProperty && this.propertyFinderForm) {
      this.propertyFinderForm.get('selectedPropertyAddress').patchValue(this.existingProperty.address);
      this.selectedPropertyDetails = this.existingProperty;
      this.isSearchVisible = false;
      // this.selectedProperty.emit()
    }
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchTerm = this.propertyFinderForm.value.searchTerm;
      this.searchProperty();
    }
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.searchProperty();
    this.suggestedTerm = '';
  }

  toggleSearch() {
    event.preventDefault();
    this.isSearchVisible = !this.isSearchVisible;
    setTimeout(() => {
      this.searchPropertyInput.nativeElement.focus();
    });
  }

  CreateNewProperty() {

  }
}
