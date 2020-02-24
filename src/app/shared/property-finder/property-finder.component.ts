import { Component, OnInit, Output, EventEmitter, Input, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
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
  @Input() isMultiple: boolean = false;
  @Input() existingProperty: Property;
  @Input() createdProperty: Property;
  @Output() selectedProperty = new EventEmitter<any>();
  @Output() selectedPropertyList = new EventEmitter<any>();
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
  selectedProperties: Property[] = [];
  suggestions: (text$: Observable<string>) => Observable<unknown>;

  get propertyAddress() {
    return this.propertyFinderForm.get('selectedPropertyAddress') as FormControl;
  }

  constructor(private propertyService: PropertyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.propertyFinderForm = this.fb.group({
      searchTerm: [''],
      selectedPropertyAddress: [''],
    });
    console.log('isMultiple in on changes not firing why', this.isMultiple)
    // this.propertyService.newPropertyAdded$.subscribe((newProperty: Property) => {
    //   if (newProperty) {
    //     this.createdProperty = newProperty;
    //     this.displayExistingProperty();
    //     console.log('should be in finder', this.createdProperty);
    //   }
    // });

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
    console.log('new property', this.createdProperty)
    console.log('isMultiple in on changes not firing why', this.isMultiple)
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
    console.log('multiple should be true here', this.isMultiple)
    this.isMultiple ? this.isSearchVisible = true : this.isSearchVisible = false;
    console.log('search visible should be true here', this.isSearchVisible)
    this.existingProperty = null;
    if (propertyId) {
      this.propertyService.getProperty(propertyId, false, false, true).subscribe(data => {
        if (data) {
          if (this.isMultiple) {
            console.log('selected prop here', data)
            this.getSelectedProperties(data);
          } else {
            this.selectedPropertyDetails = data;
            this.propertyAddress.patchValue(data.address);
            this.selectedProperty.emit(data);
          }
        }
      });
    }
  }

  getSelectedProperties(property: Property) {
    const isExisting = this.selectedProperties.filter(x => x.propertyId === property.propertyId);
    if (this.selectedProperties) {
      this.selectedProperties.push(property);
      console.log('selected props list here ZZZZZx', this.selectedProperties)
      this.selectedPropertyList.emit(this.selectedProperties);
      this.propertyFinderForm.get('searchTerm').setValue('');
    }
  }


  displayExistingProperty() {
    let property: Property;
    this.createdProperty ? property = this.createdProperty : property = this.existingProperty;
    if (property && this.propertyFinderForm) {
      this.propertyAddress.patchValue(property.address);
      this.selectedPropertyDetails = property;
      this.isMultiple ? this.isSearchVisible = true : this.isSearchVisible = false;
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

  removeProperty(propertyId: number) {
    if (this.selectedProperties && this.selectedProperties.length) {
      const index = this.selectedProperties.findIndex(x => x.propertyId === propertyId)
      this.selectedProperties.splice(index, 1);
      this.selectedPropertyList.emit(this.selectedProperties);
    }
  }

  CreateNewProperty() {

  }
}
