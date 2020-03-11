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
  @Input() isMultiple = false;
  @Input() canRebook: boolean;
  @Input() property: Property;
  @Input() propertyList: Property[];
  @Input() propertyRequiredWarning: string;
  @Output() selectedProperty = new EventEmitter<any>();
  @Output() selectedPropertyList = new EventEmitter<any>();
  @Output() rebookedProperty = new EventEmitter<number>();
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

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.propertyService.getPropertySuggestions(term).pipe(
            tap(data => {
              if (data && !data.length) {
                this.noSuggestions = true;
              } else { this.noSuggestions = false; }
            }),
            catchError(() => {
              return EMPTY;
            }))
        )
      );
    this.displayExistingProperty();
  }

  ngOnChanges() {
    console.log('%c property warning in finder', 'color: purple', this.propertyRequiredWarning);
    if (this.propertyList && this.propertyList.length) {
      this.selectedProperties = this.propertyList;
    }
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
    console.log('multiple should be true here', this.isMultiple);
    this.isMultiple ? this.isSearchVisible = true : this.isSearchVisible = false;
    console.log('search visible should be true here', this.isSearchVisible);
    this.property = null;
    if (propertyId) {
      this.propertyService.getProperty(propertyId, false, false, true).subscribe(data => {
        if (data) {
          if (this.isMultiple) {
            console.log('selected prop here', data);
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
      console.log('selected props list here ZZZZZx', this.selectedProperties);
      this.selectedPropertyList.emit(this.selectedProperties);
      this.propertyFinderForm.get('searchTerm').setValue('');
    }
  }


  displayExistingProperty() {
    if (this.property && this.propertyFinderForm) {
      this.isMultiple ? this.isSearchVisible = true : this.isSearchVisible = false;
      if (this.isMultiple) {
        this.getSelectedProperties(this.property);
      } else {
        this.propertyAddress.patchValue(this.property.address);
        this.selectedPropertyDetails = this.property;
      }
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
      const index = this.selectedProperties.findIndex(x => x.propertyId === propertyId);
      this.selectedProperties.splice(index, 1);
      this.selectedPropertyList.emit(this.selectedProperties);
    }
  }

  rebookProperty(propertyId: number) {
    if (this.selectedProperties && this.selectedProperties.length) {
      const property = this.selectedProperties.filter(x => x.propertyId === propertyId);
      this.selectedProperties = property;
      this.selectedPropertyList.emit(this.selectedProperties);
      this.rebookedProperty.emit(propertyId);
      this.canRebook = false;
    }
  }

  CreateNewProperty() {

  }
}
