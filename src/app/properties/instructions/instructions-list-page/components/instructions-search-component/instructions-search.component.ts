import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { InstructionStatus, InstructionsTableType } from '../../../instructions.interfaces'
import { format } from 'date-fns'
import { InstructionsService } from '../../../instructions.service'

@Component({
  selector: 'app-instructions-search',
  template: `
    <div class="border border-red-300 w-56 p-4 sticky top-20 z-10 card">
      <h3 class="font-bold text-md">
        <i class="fas fa-search"></i>
        Search Instructions
      </h3>

      <form [formGroup]="instructionFinderForm" autocompleteOff>
        <fieldset class="mb-0">
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

        <fieldset [ngClass]="{ invalid: false }" class="ml-0 mb-0 w-full">
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
            bsDatepicker
            #datepicker="bsDatepicker"
            [ngClass]="{ invalid: false }"
          />
          <p class="message message--negative" *ngIf="false">Invalid Expiry Date</p>
        </fieldset>

        <fieldset class="mb-0 w-full">
          <app-generic-multi-select-control
            [label]="'Status'"
            [placeholder]="'Select status'"
            [options]="statusOptions"
            [cyProp]="'valStatus'"
            (onSelectionChange)="selectionControlChange('status', $event)"
            [model]="selectControlModels.status"
          ></app-generic-multi-select-control>
        </fieldset>

        <fieldset class="mb-0 w-full">
          <app-generic-multi-select-control
            [label]="'Lister'"
            [placeholder]="'Select lister'"
            [options]="listerOptions"
            [cyProp]="'listerOptions'"
            (onSelectionChange)="selectionControlChange('listerId', $event)"
            [model]="selectControlModels.listerId"
          ></app-generic-multi-select-control>
        </fieldset>

        <fieldset class="mb-0 w-full">
          <app-generic-multi-select-control
            [label]="'Office'"
            [placeholder]="'Select office'"
            [options]="officeOptions"
            [cyProp]="'officeOptions'"
            (onSelectionChange)="selectionControlChange('officeId', $event)"
            [model]="selectControlModels.officeId"
          ></app-generic-multi-select-control>
        </fieldset>

        <fieldset class="mb-0 w-full">
          <app-generic-multi-select-control
            [label]="'Department'"
            [placeholder]="'Select department'"
            [options]="departmentOptions"
            [cyProp]="'departmentOptions'"
            (onSelectionChange)="selectionControlChange('departmentTypeArr', $event)"
            [model]="selectControlModels.departmentTypeArr"
          ></app-generic-multi-select-control>
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
      </form>
      <!-- UNCOMMENT TO SEE WHAT THE SEARCH MODEL LOOKS LIKE (handy for debugging) 
      <div>
        Search model:
        <pre>
          {{ searchModel | json }}
        </pre
        >
      </div>
      -->
    </div>
  `
})
export class InstructionsSearchComponent implements OnInit, OnDestroy {
  @Input() searchModel: any
  @Input() searchStats: any
  @Input() listerOptions: any[]
  @Input() statusOptions: any[]
  @Input() officeOptions: any[]
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onDepartmentChanged: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()

  instructionStatus = InstructionStatus

  // dropdown options. All others passed in via Input
  departmentOptions: any[] = [
    {
      value: 'Lettings',
      id: InstructionsTableType.LETTINGS
    },
    {
      value: 'Sales',
      id: InstructionsTableType.SALES
    }
  ]

  formSubscription: Subscription

  instructionFinderForm: FormGroup
  searchFormModel = {
    searchTerm: '',
    dateFrom: '',
    status: '',
    listerId: '',
    officeId: '',
    departmentType: ''
  }
  selectControlModels = {
    status: [],
    listerId: [],
    officeId: [],
    departmentTypeArr: []
  }

  queryResultCount: number

  selectionControlChange(fieldId, ev) {
    // console.log('selectionControlChange: ', fieldId, ev)
    this.instructionFinderForm.patchValue({
      [fieldId]: ev
    })
    this.selectControlModels[fieldId] = ev
    // if (fieldId === 'departmentTypeArr') {
    //   // controls the show/hide of columns in the list component
    //   const department =
    //     ev.length === 2
    //       ? InstructionsTableType.SALES_AND_LETTINGS
    //       : ev[0] === InstructionsTableType.SALES
    //       ? InstructionsTableType.SALES
    //       : InstructionsTableType.LETTINGS
    //   this.instructionFinderForm.patchValue({
    //     departmentType: department
    //   })
    // }
  }

  constructor(private fb: FormBuilder, private _instructionSvc: InstructionsService) {}

  ngOnInit() {
    this.instructionFinderForm = this.fb.group({
      searchTerm: [this.searchModel.searchTerm, Validators.nullValidator],
      dateFrom: [this.searchModel.dateFrom, Validators.nullValidator],
      status: [this.searchModel.status, Validators.nullValidator],
      listerId: [0, Validators.nullValidator],
      officeId: [0, Validators.nullValidator],
      departmentType: [this.searchModel.departmentType, Validators.nullValidator]
    })

    this.formSubscription = this.instructionFinderForm.valueChanges
      .pipe(
        filter((formData) => !!formData),
        debounceTime(300),
        map((formData) => {
          this.searchFormModel = {
            ...formData,
            dateFrom: formData.dateFrom ? format(formData.dateFrom, 'yyyy-MM-dd') : '',
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

  getInstructions() {
    this.onGetInstructions.emit({
      departmentType:
        this.selectControlModels.departmentTypeArr.length === 2
          ? InstructionsTableType.SALES_AND_LETTINGS
          : this.selectControlModels.departmentTypeArr[0] === InstructionsTableType.SALES
          ? InstructionsTableType.SALES
          : InstructionsTableType.LETTINGS
    })
  }

  suggestionSelected(e) {}

  // TODO move this out of here up into instructions-shell-component
  searchSuggestions$ = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(200),
      distinctUntilChanged(),
      switchMap((term) => {
        const department = this.searchFormModel.departmentType
        return this._instructionSvc.getInstructionsSuggestions(term, department).pipe(
          catchError(() => {
            return EMPTY
          })
        )
      })
    )
}
