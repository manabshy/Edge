import { Component, OnInit } from '@angular/core'
import { ValuationFacadeService } from '../../shared/valuation-facade.service'
import { distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { Valuation, ValuationStatuses, ValuationStatusEnum } from '../../shared/valuation'
import { WedgeError } from '../../../core/services/shared.service'
import { StorageMap } from '@ngx-pwa/local-storage'
import { StaffMember, Office } from '../../../shared/models/staff-member'
import { BaseComponent } from '../../../shared/models/base-component'
import { StaffMemberService } from '../../../core/services/staff-member.service'
import { OfficeService } from '../../../core/services/office.service'
import { Router, ActivatedRoute } from '@angular/router'
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-valuations-list-page-shell',
  template: `
    <app-pure-valuations-list-page-shell
      [valuerOptions]="valuersForSelect"
      [statusOptions]="statuses"
      [officeOptions]="offices"
      [isMessageVisible]="isMessageVisible"
      [isHintVisible]="isHintVisible"
      [searchModel]="searchModel"
      [searchStats]="searchStats"
      [valuations]="valuations"
      [currentStaffMember]="currentStaffMember"
      (onSearchModelChanges)="onSearchModelChanges($event)"
      (onNavigateTo)="navigateToValuation($event)"
      (onGetValuations)="getNextValuationsPage()"
      (onScrollDown)="onScrollDown()"
    ></app-pure-valuations-list-page-shell>
  `
})
export class ValuationsShellComponent extends BaseComponent implements OnInit {
  valuations: Valuation[] = []
  valuers: StaffMember[]
  valuersForSelect: Array<any> = []
  offices: Office[] = []
  statuses = ValuationStatuses
  isMessageVisible: boolean
  isHintVisible: boolean
  isAdvancedSearchVisible: boolean = false
  bottomReached = false
  currentStaffMember: StaffMember

  searchModel = {
    searchTerm: '',
    suggestedTerm: '',
    date: '',
    status: [0],
    valuerId: [0],
    officeId: [0],
    orderBy: '-valuationDate',
    page: 1,
    pageSize: 20
  }

  selectControlModels = {
    status: [],
    valuerId: [],
    officeId: []
  }

  searchStats: any = {
    queryCount: true,
    pageLength: 20,
    queryResultCount: 0
  }

  onSearchModelChanges(ev) {
    console.log('onSearchModelChanges: ', ev)
    this.searchModel = {
      ...this.searchModel,
      ...ev,
      page: 1 // first page of new search
    }
    console.log('merged searchModel: ', this.searchModel)
  }

  onScrollDown() {
    this.searchModel.page += 1
    this.getNextValuationsPage()
  }

  constructor(
    private _valuationFacadeSvc: ValuationFacadeService,
    private staffMemberService: StaffMemberService,
    private officeService: OfficeService,
    private storage: StorageMap,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    super()
  }

  ngOnInit() {
    this.getValuers()
    this.getOffices()
    this.getCurrentStaffMember()
    this.getValuations()
  }

  public getValuations() {
    this.searchModel.page = 1
    this.bottomReached = false
    this.valuations = []
    this.getNextValuationsPage()
  }

  getNextValuationsPage() {
    console.log('getNextValuationsPage start: ', this.searchModel)
    this._valuationFacadeSvc
      .getValuations(this.searchModel)
      .pipe(
        distinctUntilChanged(),
        map((results) => {
          return results.map((result) => {
            return {
              ...result,
              valuationStatusLabel: ValuationStatusEnum[result.valuationStatus]
            }
          })
        })
      )
      .subscribe({
        next: (result) => {
          // console.log('getNextValuationsPage next: ', result)

          if (this.searchModel.searchTerm) {
            if (result && !result.length) {
              this.isMessageVisible = true
              this.bottomReached = true
            } else {
              this.isMessageVisible = false
            }
          }
          if (result && result.length) {
            this.searchStats.queryResultCount = result[0]?.queryResultCount
            if (this.searchModel.page === 1) {
              this.isAdvancedSearchVisible = false
              this.valuations = result
            } else {
              this.valuations = this.valuations.concat(result)
            }
          } else {
            this.searchStats.queryResultCount = 0
          }
        },
        error: (error: WedgeError) => {
          console.error('error: ', error)
          this.valuations = []
          this.searchModel.searchTerm = ''
          this.isHintVisible = true
        }
      })
  }

  suggestionSelected(event) {
    if (event.item != null) {
      this.searchModel.suggestedTerm = event.item
    }
    this.getValuations()
    this.searchModel.suggestedTerm = ''
  }

  navigateToValuation(val: Valuation) {
    let path = ['detail', val?.valuationEventId, 'edit']
    if (val.valuationStatus === ValuationStatusEnum.Cancelled || val.valuationStatus === ValuationStatusEnum.Closed) {
      path = ['detail', val?.valuationEventId, 'cancelled']
    } else if (val.valuationStatus === ValuationStatusEnum.Instructed) {
      path = ['detail', val?.valuationEventId, 'instructed']
    }
    this.router.navigate(path, { relativeTo: this.activatedRoute })
  }

  private getCurrentStaffMember() {
    console.log('getCurrentStaffMember start')
    this.staffMemberService
      .getCurrentStaffMember()
      .toPromise()
      .then((res) => {
        console.log('getCurrentStaffMember then: ', res)
        this.currentStaffMember = res
        this.getValuations()
      })
  }

  private getValuers() {
    this.storage.get('activeStaffmembers').subscribe((data) => {
      if (data) {
        this.valuers = data as StaffMember[]
        this.setValuersForSelectControl()
      } else {
        this.staffMemberService
          .getActiveStaffMembers()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result) => {
            this.valuers = result.result
            this.setValuersForSelectControl()
          })
      }
    })
  }

  private setValuersForSelectControl() {
    this.valuersForSelect = this.valuers.map((valuer) => {
      return {
        id: valuer.staffMemberId,
        value: valuer.fullName
      }
    })
  }

  private getOffices() {
    this.officeService
      .getOffices()
      .toPromise()
      .then((res) => {
        this.offices = res.result.map((office) => {
          return {
            id: office.officeId,
            value: office.name
          }
        })
      })
  }
}
