import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { ValuationService } from './shared/valuation.service';
import { debounceTime, distinctUntilChanged, switchMap, catchError } from 'rxjs/operators';
import { Valuation, ValuationRequestOption, ValuationStatus, getValuationStatuses } from './shared/valuation';
import { WedgeError, SharedService } from '../core/services/shared.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { StaffMember, Office } from '../shared/models/staff-member';

@Component({
  selector: 'app-valuations',
  templateUrl: './valuations.component.html',
  styleUrls: ['./valuations.component.scss']
})
export class ValuationsComponent implements OnInit {
  valuationFinderForm: FormGroup;
  valuations: Valuation[] = [];
  searchTerm = '';
  suggestedTerm = '';
  isMessageVisible: boolean;
  isHintVisible: boolean;
  page: number;
  bottomReached = false;
  suggestions: (text$: Observable<any>) => Observable<any>;
  listers: StaffMember[];
  offices: Office[];
  statuses: any;
  get searchTermControl() {
    return this.valuationFinderForm.get('searchTerm') as FormControl;
  }
  public keepOriginalOrder = (a) => a.key;

  constructor(private valuationService: ValuationService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private fb: FormBuilder) { }

  ngOnInit() {

    this.setupForm();
    this.getValuations();
    this.statuses = getValuationStatuses();

    // All Active listers
    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.listers = data as StaffMember[];
      }
    });

    // Offices
    this.storage.get('offices').subscribe(data => {
      if (data) {
        this.offices = data as Office[];
      }
    });

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.valuationService.getValuationSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))));
  }

  private setupForm() {
    this.valuationFinderForm = this.fb.group({
      searchTerm: '',
      date: null,
      statusId: 0,
      listerId: 0,
      officeId: 0,
    });
  }

  getValuations() {
    this.page = 1;
    this.bottomReached = false;
    this.valuations = [];
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.searchTermControl.value;
    this.getNextValuationsPage(this.page);
  }

  getNextValuationsPage(page: number) {
    const request = {
      page: page,
      searchTerm: this.searchTerm
    } as ValuationRequestOption;

    this.valuationService.getValuations(request).subscribe(result => {
      if (this.searchTerm && this.searchTerm.length) {
        if (result && !result.length) {
          this.isMessageVisible = true;
          this.bottomReached = true;
        } else {
          this.isMessageVisible = false;
        }
      }
      if (result && result.length) {
        this.valuations = this.valuations.concat(result);
      }
    }, (error: WedgeError) => {
      this.valuations = [];
      this.searchTerm = '';
      this.isHintVisible = true;
      this.sharedService.showError(error);
    });
  }

  suggestionSelected(event) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
      console.log('suggestion', this.suggestedTerm)
    }
    this.getValuations();
    this.suggestedTerm = '';
  }

  enter(event) {
    console.log('event entered', event);
  }
}

