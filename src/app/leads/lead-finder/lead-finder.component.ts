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

  @Input() leadSuggestion: string;
  @Output() leadSearchTerm = new EventEmitter();
  suggestions: (text$: Observable<any>) => Observable<any>;
  searchTerm = '';
  suggestedTerm = '';
  leadFinderForm: FormGroup;

  constructor(private leadService: LeadsService, private fb: FormBuilder) { }

  ngOnInit() {

    this.leadFinderForm = this.fb.group({
      leadSuggestion: this.leadSuggestion || AppUtils?.leadSearchInfo?.leadSearchTerm || ''
    });

    console.log(this.leadFinderForm.value, 'lead finder form');

    this.leadFinderForm.valueChanges.subscribe(data => {
      if (data && data.leadSuggestion) {
        this.leadSearchTerm.emit(data.leadSuggestion);
      } else {
        this.leadService.leadsSearchTermChanged('');
      }

    });

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

  onKeyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchTerm = this.leadFinderForm.value.leadSuggestion;
      this.leadService.leadsSearchTermChanged(this.searchTerm);
    }
  }



  submit(event) {
    this.searchTerm = this.leadFinderForm.value.leadSuggestion;
    this.leadService.leadsSearchTermChanged(this.searchTerm);
  }

  suggestionSelected(event: any) {
    if (event && event.item) {
      console.log('event  here', event);
      this.suggestedTerm = event.item;
      this.leadService.leadsSearchTermChanged(event.item);
    }
    this.suggestedTerm = '';
  }
}
