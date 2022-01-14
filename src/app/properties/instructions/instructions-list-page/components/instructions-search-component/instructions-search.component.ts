import { Component, OnInit, Input, OnDestroy, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core'
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { EMPTY, Observable, Subscription } from 'rxjs'
import { catchError, debounceTime, distinctUntilChanged, filter, map, switchMap } from 'rxjs/operators'
import { InstructionStatusForSalesAndLettingsEnum, InstructionsTableType } from '../../../instructions.interfaces'
import { format } from 'date-fns'
import { InstructionsService } from '../../../instructions.service'
import { RoleName, StaffMember } from 'src/app/shared/models/staff-member'
import {
  statusesForSalesAndLettingsSearch,
  statusesForSalesSearch,
  statusesForLettingsSearch
} from '../../../instructions.store.helper-functions'

export interface InstructionsSearchModel {
  searchTerm: string
  dateFrom: string
  status: string
  departmentType: string
  orderBy: string
}

export interface InstructionsSearchStats {
  queryCount: boolean
  pageLength: number
  queryResultCount: number
}

export interface InstructionsSearchDropdowns {
  id: string
  valude: string
}

@Component({
  selector: 'app-instructions-search',
  template: `
    <div class="border border-solid border-gray-300 rounded-md w-56 p-4 sticky top-20 z-10">
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

        <fieldset class="mb-0 w-full">Sort order {{ searchModel.orderBy }}</fieldset>

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
      <!--  <div>
        {{ searchFormModel | json }}
      </div> -->
    </div>
  `
})
export class InstructionsSearchComponent implements OnInit, OnDestroy, OnChanges {
  @Input() searchModel: InstructionsSearchModel
  @Input() searchStats: InstructionsSearchStats
  @Input() listerOptions: InstructionsSearchDropdowns[]
  @Input() statusOptions: InstructionsSearchDropdowns[]
  @Input() officeOptions: InstructionsSearchDropdowns[]
  @Input() currentStaffMember: StaffMember

  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onDepartmentChanged: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()

  InstructionStatusForSalesAndLettingsEnum = InstructionStatusForSalesAndLettingsEnum

  // dropdown options. All others passed in via an @Input
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
    departmentType: '',
    orderBy: ''
  }

  selectControlModels = {
    status: [],
    listerId: [],
    officeId: [],
    departmentTypeArr: []
  }

  queryResultCount: number

  /***
   * updates the model when dropdown values change
   */
  selectionControlChange(fieldId, ev) {
    this.instructionFinderForm.patchValue({
      [fieldId]: ev
    })
    this.selectControlModels[fieldId] = ev
    if (fieldId == 'departmentTypeArr') {
      this.statusOptions = this.setStatusOptionsForDepartmentType()
    }
  }

  private setStatusOptionsForDepartmentType() {
    switch (this.currentDepartmentValue()) {
      case InstructionsTableType.SALES_AND_LETTINGS:
        console.log('setStatusOpstions for sales and lettings')
        return this.setStatusesForSalesAndLettings()
        
        case InstructionsTableType.SALES:
        console.log('setStatusOpstions for sales')
        return this.setStatusesForSales()
        
        case InstructionsTableType.LETTINGS:
        console.log('setStatusOpstions for lettings')
        return this.setStatusesForLettings()
    }
  }

  private setStatusesForSales() {
    return statusesForSalesSearch()
  }

  private setStatusesForLettings() {
    return statusesForLettingsSearch()
  }

  private setStatusesForSalesAndLettings() {
    return statusesForSalesAndLettingsSearch()
  }

  constructor(private fb: FormBuilder, private _instructionSvc: InstructionsService) {}

  ngOnInit() {
    this.instructionFinderForm = this.fb.group({
      searchTerm: [this.searchModel.searchTerm, Validators.nullValidator],
      dateFrom: [this.searchModel.dateFrom, Validators.nullValidator],
      status: [this.searchModel.status, Validators.nullValidator],
      listerId: [0, Validators.nullValidator],
      officeId: [0, Validators.nullValidator],
      departmentType: [this.searchModel.departmentType, Validators.nullValidator],
      orderBy: [this.searchModel.orderBy, Validators.nullValidator]
    })

    this.formSubscription = this.instructionFinderForm.valueChanges
      .pipe(
        filter((formData) => !!formData),
        debounceTime(300),
        map((formData: any) => {
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

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.currentStaffMember && !changes.currentStaffMember.firstChange) {
      this.currentStaffMember = changes.currentStaffMember.currentValue
      this.setInitialFilters()
    }
  }

  private currentDepartmentValue() {
    return this.selectControlModels.departmentTypeArr.length === 2
      ? InstructionsTableType.SALES_AND_LETTINGS
      : this.selectControlModels.departmentTypeArr[0] === InstructionsTableType.SALES
      ? InstructionsTableType.SALES
      : InstructionsTableType.LETTINGS
  }

  getInstructions() {
    this.onGetInstructions.emit({
      departmentType: this.currentDepartmentValue()
    })
  }

  /***
   * sets initial values for dropdowns in the form
   */
  private setInitialFilters() {
    this.setInitialStatusId()
    this.setInitialListerId()
    this.setInitialOfficeId()
    this.setInitialDepartmentId()
  }

  /***
   * sets the initial status dropdown value
   */
  private setInitialStatusId() {
    if (this.isManager() || this.isBroker() || this.isOfficeManager()) {
      this.selectControlModels.status = ['instructed']
    } else {
      this.selectControlModels.status = []
    }
  }

  /***
   * sets the initial lister dropdown value
   */
  private setInitialListerId() {
    if (this.currentStaffMember.roles && this.currentStaffMember.roles.length) {
      if (this.isManager() || this.isBroker()) {
        this.selectControlModels.listerId = [this.currentStaffMember.staffMemberId]
      } else {
        this.selectControlModels.listerId = []
      }
    }
  }

  /***
   * sets the initial department (Sales/Lettings) dropdown value
   */
  private setInitialDepartmentId() {
    if (this.currentStaffMember.roles && this.currentStaffMember.roles.length) {
      if (this.isManager() || this.isBroker()) {
        this.selectControlModels.departmentTypeArr = [InstructionsTableType.LETTINGS]
      } else {
        this.selectControlModels.departmentTypeArr = [InstructionsTableType.SALES]
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

  /***
   * sets the initial office dropdown value
   */
  private setInitialOfficeId() {
    if (this.isOfficeManager()) {
      this.selectControlModels.officeId = [this.currentStaffMember.officeId]
    } else {
      this.selectControlModels.officeId = []
    }
  }

  suggestionSelected(e) {}

  /***
   * drives the suggestions dropdown
   // TODO move this out of here up into instructions-shell-component in order to keep dependency injection in shell component
   */
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
