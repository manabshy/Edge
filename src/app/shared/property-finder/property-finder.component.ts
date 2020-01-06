import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyService } from 'src/app/property/shared/property.service';
import { Observable, EMPTY } from 'rxjs';
import { distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Property, PropertyAutoComplete } from 'src/app/property/shared/property';
import { RequestOption } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-property-finder',
  templateUrl: './property-finder.component.html',
  styleUrls: ['./property-finder.component.css']
})
export class PropertyFinderComponent implements OnInit {
  @Output() selectedProperty = new EventEmitter<any>();
  properties: PropertyAutoComplete[];
  propertyFinderForm: FormGroup;
  suggestions: (text$: Observable<string>) => Observable<unknown>;
  searchTerm = '';
  PAGE_SIZE = 20;
  suggestedTerm = '';

  constructor(private propertyService: PropertyService, private fb: FormBuilder) { }

  ngOnInit() {
    this.propertyFinderForm = this.fb.group({
      searchTerm: [''],
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

  searchProperty() {
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.propertyFinderForm.value.searchTerm;
    const requestOptions = {
      pageSize: this.PAGE_SIZE,
      searchTerm: this.searchTerm
    } as RequestOption;
    this.propertyService.autocompleteProperties(requestOptions).subscribe(result => {
      if (result && result.length) {
        this.properties = result;
      }

    }, error => {
      this.properties = [];
      this.searchTerm = '';
    });
  }

  selectProperty(propertyId: number) {
    if (propertyId) {
      this.propertyService.getProperty(propertyId, true, true).subscribe(data => {
        if (data) {
          this.selectedProperty.emit(data);
        }
      });
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
}
