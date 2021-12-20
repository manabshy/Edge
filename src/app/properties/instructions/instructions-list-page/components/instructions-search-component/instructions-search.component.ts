import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { InstructionStatus } from '../../../instructions.interfaces'
import { format } from 'date-fns'
import { InstructionsService } from '../../../instructions.service'

@Component({
  selector: 'app-instructions-search',
  template: `
    <div class="border border-grey-300 w-56 p-4">
      <h3 class="font-bold text-md">
        <i class="fas fa-search"></i>
        Search Instructions
      </h3>

      <form [formGroup]="instructionFinderForm" autocompleteOff>
        <div class="flex flex-col">
          <fieldset class="mb-3">
            <label for="instructionSearch">Name, email, phone or address</label>
            <input
              class="p-2"
              type="search"
              id="instructionSearch"
              data-testid="instructionSearch"
              aria-label="Search criteria"
              [ngbTypeahead]="searchSuggestions$"
              [focusFirst]="false"
              (selectItem)="suggestionSelected($event)"
              (keydown.enter)="getInstructions()"
              formControlName="searchTerm"
            />
          </fieldset>

          <fieldset [ngClass]="{ invalid: false }" class="ml-0 mb-3 w-full">
            <label for="">Date From</label>
            <input
              class="p-2 mt-1"
              type="text"
              id="dateFrom"
              placeholder="dd/mm/yyyy"
              formControlName="dateFrom"
              [bsConfig]="{
                showWeekNumbers: false,
                dateInputFormat: 'DD/MM/YYYY',
                customTodayClass: 'font-weight-bold'
              }"
              (bsValueChange)="onDateChange($event)"
              bsDatepicker
              #datepicker="bsDatepicker"
              [ngClass]="{ invalid: false }"
            />
            <p class="message message--negative" *ngIf="false">Invalid Expiry Date</p>
          </fieldset>

          <fieldset class="mb-3 w-full">
            <app-generic-multi-select-control
              [label]="'Status'"
              [placeholder]="'Select status'"
              [options]="statusOptions"
              [cyProp]="'valStatus'"
              (onSelectionChange)="selectionControlChange('status', $event)"
              [model]="selectControlModels.status"
            ></app-generic-multi-select-control>
          </fieldset>

          <fieldset class="mb-3 w-full">
            <app-generic-multi-select-control
              [label]="'Valuer'"
              [placeholder]="'Select valuer'"
              [options]="valuerOptions"
              [cyProp]="'valStatus'"
              (onSelectionChange)="selectionControlChange('valuerId', $event)"
              [model]="selectControlModels.valuerId"
            ></app-generic-multi-select-control>
          </fieldset>

          <fieldset class="mb-3 w-full">
            <app-generic-multi-select-control
              [label]="'Office'"
              [placeholder]="'Select office'"
              [options]="officeOptions"
              [cyProp]="'valStatus'"
              (onSelectionChange)="selectionControlChange('officeId', $event)"
              [model]="selectControlModels.officeId"
            ></app-generic-multi-select-control>
          </fieldset>

          <fieldset class="mb-3 w-full">
            <label for="Department">Department</label>
            <p-dropdown
              [disabled]="false"
              [options]="departmentOptions"
              formControlName="departmentType"
              optionLabel="label"
              optionValue="value"
              [filter]="false"
              data-cy="departmentType"
            ></p-dropdown>
          </fieldset>

          <div class="flex">
            <button class="btn btn--info" id="btnSearch" (click)="getInstructions()" data-cy="searchInstructions">
              Search
            </button>
            <div class="flex ml-2" *ngIf="searchStats.queryCount">
              <span class="font-extrabold !important mt-2">
                {{ searchStats.pageLength }} of {{ searchStats.queryResultCount }}
              </span>
            </div>
          </div>
        </div>
      </form>
    </div>
  `
})
export class InstructionsSearchComponent implements OnInit, OnDestroy {
  // @Input() searchSuggestions$: Observable<any>
  @Input() searchStats: any
  @Input() valuerOptions: any[]
  @Input() statusOptions: any[]
  @Input() officeOptions: any[]
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()

  instructionStatus = InstructionStatus

  searchFormModel = {
    searchTerm: '',
    dateFrom: '',
    status: '',
    valuerId: '',
    officeId: '',
    departmentType: ''
  }

  // dropdown options. All others passed in via Input
  departmentOptions: any[] = [
    {
      label: 'Lettings',
      value: 'LettingsInstruction'
    },
    {
      label: 'Sales',
      value: 'SalesInstruction'
    }
  ]

  formSubscription: Subscription

  instructionFinderForm: FormGroup = this.fb.group({
    searchTerm: ['', Validators.nullValidator],
    dateFrom: ['', Validators.nullValidator],
    statusId: ['', Validators.nullValidator],
    valuerId: [0, Validators.nullValidator],
    officeId: [0, Validators.nullValidator],
    departmentType: ['LettingsInstruction', Validators.nullValidator]
  })

  selectControlModels = {
    status: [],
    valuerId: [],
    officeId: []
  }

  queryResultCount: number

  selectionControlChange(fieldId, ev) {
    this.instructionFinderForm.patchValue({
      [fieldId]: ev
    })
    this.selectControlModels[fieldId] = ev
  }

  constructor(private fb: FormBuilder, private _instructionSvc: InstructionsService){

    this.formSubscription = this.instructionFinderForm.valueChanges
      .pipe(
        filter((formData) => !!formData),
        debounceTime(300),
        map((formData) => {
          console.log('formData: ', formData)
          this.searchFormModel = {
            ...formData,
            dateFrom: formData.dateFrom ? format(formData.dateFrom, 'yyyy-MM-dd') : '',
            ...this.selectControlModels
          }
        })
      )
      .subscribe()
  }

  ngOnInit() {
    
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe()
  }

  onDateChange(d) {
    console.log('onDateChange: ', d)
  }

  getInstructions() {
    console.log('searchPayload: ', this.searchFormModel)
    this.onGetInstructions.emit(this.searchFormModel)
  }
  suggestionSelected(e) {}

  searchSuggestions$ = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) =>{
        const department = this.searchFormModel.departmentType
        return this._instructionSvc.getInstructionsSuggestions(term, department).pipe(
          catchError(() => {
            return EMPTY
          })
        )}
      )
    )
}
