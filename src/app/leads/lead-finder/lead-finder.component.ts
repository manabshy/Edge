import { Component, OnInit, Output, EventEmitter } from '@angular/core';
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
      leadSuggestion: ''
    });

    this.leadFinderForm.valueChanges.subscribe(val => {
      console.log('new lead suggestion', val.leadSuggestion);
      if (val.leadSuggestion === '') {
        this.leadSuggestionSelected.emit(null);
        console.log(true);
      }
      else{
        console.log(false);
      }
    });

  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {

    }
    AppUtils.searchTerm = this.searchTerm;
  }

  suggestionSelected(event: any) {
    this.leadSuggestionSelected.emit(event);
  }

}
