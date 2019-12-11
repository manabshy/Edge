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
  leadFinderForm: FormGroup;

  constructor(private leadService: LeadsService, private fb: FormBuilder) { }

  ngOnInit() {

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.leadService.getLeadSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))));


    this.leadFinderForm = this.fb.group({
      leadSuggestion: AppUtils.leadSearchTerm
    });

    this.leadFinderForm.get('leadSuggestion').setValue(AppUtils.leadSearchTerm);

  }

  // ngOnChanges() {
  //   this.leadFinderForm.get('leadSearchTerm').setValue(this.searchTerm);
  //   console.log('lead search term:', this.searchTerm);
  // }

  onKeyup(event: KeyboardEvent) {
    AppUtils.leadSearchTerm = this.searchTerm;
  }

  

  submit(event) {
    this.leadSuggestionSelected.emit(this.leadFinderForm.get('leadSuggestion').value);
  }

  suggestionSelected(event: any) {
    this.leadSuggestionSelected.emit(event);
  }

}
