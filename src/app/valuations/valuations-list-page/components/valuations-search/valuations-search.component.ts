import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { format } from 'date-fns'
import { ValuationFacadeService } from 'src/app/valuations/shared/valuation-facade.service'
import { RoleName, StaffMember } from 'src/app/shared/models/staff-member'

@Component({
  selector: 'app-valuations-search',
  template: `
    <div class="row__item row__item--aside">
      <div class="wrapper--sticky">
        <div class="card">
          <div class="card__header" id="searchValuationsCard">
            <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" class="icon icon--onLeft">
              <path
                d="M45.6 36.9c1.9-3.6 3.2-7.8 3.2-12.4C48.8 11.1 37.8 0 24.4 0S0 11.1 0 24.5 11 49 24.4 49c4.5 0 8.8-1 12.3-3.3L54.9 64l9.1-8.5L45.6 36.9zM24.5 40.8c-9.1 0-16.2-7.2-16.2-16.3S15.4 8.2 24.5 8.2s16.2 7.2 16.2 16.3C40.7 33.6 33.6 40.8 24.5 40.8z"
              />
            </svg>
            <span class="text-md">Search Valuations</span>
          </div>
          <div class="card__body">
            <form [formGroup]="valuationFinderForm" autocompleteOff>
              <fieldset class="mb-3">
                <label for="valuationSearch">Name, email, phone or address</label>
                <input
                  class="p-2"
                  type="search"
                  id="valuationSearch"
                  aria-label="Search criteria"
                  (keydown.enter)="onGetInstructions.emit()"
                  [ngbTypeahead]="searchSuggestions$"
                  [focusFirst]="false"
                  (selectItem)="suggestionSelected($event)"
                  formControlName="searchTerm"
                />
              </fieldset>

              <fieldset class="mb-3">
                <label for="date">Date From</label>
                <input
                  class="p-2"
                  type="text"
                  id="date"
                  placeholder="dd/mm/yyyy"
                  [bsConfig]="{
                    showWeekNumbers: false,
                    dateInputFormat: 'DD/MM/YYYY',
                    customTodayClass: 'font-weight-bold'
                  }"
                  bsDatepicker
                  #datepicker="bsDatepicker"
                  [appNoDoubleTap]="datepicker"
                  formControlName="date"
                  data-cy="date"
                />
              </fieldset>

              <fieldset class="mb-3">
                <app-generic-multi-select-control
                  [label]="'Status'"
                  [placeholder]="'Select status'"
                  [options]="statusOptions"
                  [cyProp]="'valStatus'"
                  (onSelectionChange)="selectionControlChange('status', $event)"
                  [model]="selectControlModels.status"
                ></app-generic-multi-select-control>
              </fieldset>

              <fieldset class="mb-3">
                <app-generic-multi-select-control
                  *ngIf="officeOptions.length"
                  [label]="'Valuer'"
                  [placeholder]="'Select staff member'"
                  [options]="valuersForSelect"
                  [cyProp]="'valuerId'"
                  (onSelectionChange)="selectionControlChange('valuerId', $event)"
                  [model]="selectControlModels.valuerId"
                ></app-generic-multi-select-control>
              </fieldset>

              <fieldset class="mb-3">
                <app-generic-multi-select-control
                  *ngIf="officeOptions.length"
                  [label]="'Office'"
                  [placeholder]="'Select Office'"
                  [options]="officeOptions"
                  [cyProp]="'officeId'"
                  (onSelectionChange)="selectionControlChange('officeId', $event)"
                  [model]="selectControlModels.officeId"
                ></app-generic-multi-select-control>
              </fieldset>

              <div class="flex">
                <fieldset class="mr-2">
                  <button class="btn btn--info" id="btnSearch" (click)="onGetInstructions.emit()" data-cy="searchVal">
                    Search
                  </button>
                </fieldset>
                <fieldset class="flex" *ngIf="queryResultCount">
                  <span class="font-extrabold !important mt-2">
                    {{ valuations?.length }} of {{ queryResultCount }} Val
                  </span>
                </fieldset>
              </div>
            </form>
          </div>
        </div>
        <div class="card">
          <div class="card__header">Actions</div>
          <div class="card__body card__body--list">
            <ol class="list list--divider list--hover">
              <li>
                <a
                  class="overall"
                  [routerLink]="['detail', 0, 'edit']"
                  [queryParams]="{ isNewValuation: true }"
                  data-cy="newVal"
                ></a>
                <svg
                  aria-hidden="true"
                  width="64"
                  height="64"
                  viewBox="0 0 64 64"
                  class="icon icon--s icon--fill-positive icon--onLeft"
                >
                  <path
                    d="M60 35.9H4c-2.2 0-4-1.8-4-4v0c0-2.2 1.8-4 4-4h56c2.2 0 4 1.8 4 4v0C64 34.1 62.2 35.9 60 35.9z"
                  />
                  <path
                    class="plus-vertical"
                    d="M28 59.9v-56c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4v56c0 2.2-1.8 4-4 4h0C29.8 63.9 28 62.2 28 59.9z"
                  />
                </svg>
                Create Valuation
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ValuationsSearchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() searchModel: any
  @Input() searchStats: any
  @Input() valuerOptions: any[]
  @Input() statusOptions: any[]
  @Input() officeOptions: any[]
  @Input() currentStaffMember: StaffMember

  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()

  formSubscription: Subscription
  valuationFinderForm: FormGroup

  searchFormModel = {
    searchTerm: '',
    date: '',
    status: '',
    valuerId: '',
    officeId: ''
  }

  selectControlModels = {
    status: [],
    valuerId: [],
    officeId: []
  }

  queryResultCount: number

  selectionControlChange(fieldId, ev) {
    console.log('selectionControlChange: ', fieldId, ev)
    this.valuationFinderForm.patchValue({
      [fieldId]: ev
    })
    this.selectControlModels[fieldId] = ev
  }

  constructor(private fb: FormBuilder, private _valuationFacadeSvc: ValuationFacadeService) {}

  ngOnInit() {
    this.setupForm()

    this.formSubscription = this.valuationFinderForm.valueChanges
      .pipe(
        filter((formData) => !!formData),
        debounceTime(300),
        map((formData) => {
          this.searchFormModel = {
            ...formData,
            date: formData.date ? format(formData.date, 'yyyy-MM-dd') : '',
            ...this.selectControlModels
          }
          this.onSearchModelChanges.emit(this.searchFormModel)
        })
      )
      .subscribe()
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe()
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentStaffMember && !changes.currentStaffMember.isFirstChange) {
      this.currentStaffMember = changes.currentStaffMember.currentValue
      this.setInitialFilters()
    }
  }

  getInstructions() {
    this.onGetInstructions.emit()
  }

  suggestionSelected(e) {}

  // TODO move this out of here up into instructions-shell-component
  searchSuggestions$ = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        return this._valuationFacadeSvc.getValuationSuggestions(term).pipe(
          catchError(() => {
            return EMPTY
          })
        )
      })
    )

  private setupForm() {
    this.valuationFinderForm = this.fb.group({
      searchTerm: [this.searchModel.searchTerm, Validators.nullValidator],
      date: [this.searchModel.date, Validators.nullValidator],
      status: [this.searchModel.status, Validators.nullValidator],
      valuerId: [this.searchModel.valuerId, Validators.nullValidator],
      officeId: [this.searchModel.officeId, Validators.nullValidator]
    })
  }

  private setInitialFilters() {
    this.setInitialStatusId()
    this.setInitialValuerId()
    this.setInitialOfficeId()
  }

  private setInitialStatusId() {
    this.selectControlModels.status = [2, 3] // Booked, Valued. Default for all users
  }

  private setInitialValuerId() {
    if (this.currentStaffMember.roles && this.currentStaffMember.roles.length) {
      if (this.isManager() || this.isBroker()) {
        this.selectControlModels.valuerId = [this.currentStaffMember.staffMemberId]
      } else {
        this.selectControlModels.valuerId = []
      }
    }
  }

  private isManager(): boolean {
    if (this.currentStaffMember.roles.findIndex((x) => x.roleName === RoleName.Manager) > -1) {
      return true
    }
    return false
  }

  private isBroker(): boolean {
    if (this.currentStaffMember.roles.findIndex((x) => x.roleName === RoleName.Broker) > -1) {
      return true
    }
    return false
  }

  private isOfficeManager(): boolean {
    if (this.currentStaffMember.roles.findIndex((x) => x.roleName === RoleName.OfficeManager) > -1) {
      return true
    }
    return false
  }

  private setInitialOfficeId() {
    if (this.isOfficeManager()) {
      this.selectControlModels.officeId = [this.currentStaffMember.officeId]
    } else {
      this.selectControlModels.officeId = []
    }
  }
}
