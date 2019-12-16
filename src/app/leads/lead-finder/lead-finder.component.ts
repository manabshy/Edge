import { Component, OnInit, Output, EventEmitter, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { LeadsService } from '../shared/leads.service';
import { EMPTY } from 'rxjs';
import { AppUtils } from 'src/app/core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-lead-finder',
  templateUrl: './lead-finder.component.html',
  styleUrls: ['./lead-finder.component.scss']
})
export class LeadFinderComponent implements OnInit {

  @Output() leadSuggestionSelected = new EventEmitter();
  suggestions: (text$: Observable<any>) => Observable<any>;
  searchTerm = '';
  suggestedTerm = '';
  leadFinderForm: FormGroup;

  constructor(private leadService: LeadsService, private fb: FormBuilder) { }

  ngOnInit() {

    this.leadFinderForm = this.fb.group({
      leadSuggestion: ''
    });
    this.leadFinderForm.valueChanges.pipe(debounceTime(800)).subscribe(search => {
      AppUtils.leadSearchTerm = '';
      if (search && search.leadSuggestion) {
        console.log('search data', search);
        console.log('AppUtils search term data', AppUtils.leadSearchTerm);
        this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = search.leadSuggestion;
        this.leadService.leadsSearchTermChanged(this.searchTerm);
      }
    });

    // this.leadFinderForm.get('leadSuggestion').setValue(AppUtils.leadSearchTerm);

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.leadService.getLeadSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))));

  }

  // ngOnChanges() {
  //   this.leadFinderForm.get('leadSearchTerm').setValue(this.searchTerm);
  //   console.log('lead search term:', this.searchTerm);
  // }

  onKeyup(event: KeyboardEvent) {
    // AppUtils.leadSearchTerm = this.searchTerm;
    this.leadService.leadsSearchTermChanged(this.searchTerm);
    console.log(' AppUtils.leadSearchTerm term here',   AppUtils.leadSearchTerm);
  }



  submit(event) {
    console.log('search term here 2', this.leadFinderForm.value.leadSuggestion);
    this.leadService.leadsSearchTermChanged(this.searchTerm);
    // this.leadSuggestionSelected.emit(this.leadFinderForm.get('leadSuggestion').value);
  }

  suggestionSelected(event: any) {
    if (event && event.item) {
      console.log('event  here', event);
      this.suggestedTerm = event.item;
      this.leadService.leadsSearchTermChanged(this.searchTerm);
      // this.leadSuggestionSelected.emit(event);
    }
     this.suggestedTerm = '';
  }

}
