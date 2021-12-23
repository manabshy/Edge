import { Component, OnInit } from '@angular/core'
import { ValuationFacadeService } from '../../shared/valuation-facade.service'
import { distinctUntilChanged, takeUntil } from 'rxjs/operators'
import { Valuation, ValuationStatuses, ValuationStatusEnum } from '../../shared/valuation'
import { WedgeError, SharedService } from '../../../core/services/shared.service'
import { StorageMap } from '@ngx-pwa/local-storage'
import { StaffMember, Office, RoleName } from '../../../shared/models/staff-member'
import { BaseComponent } from '../../../shared/models/base-component'
import { StaffMemberService } from '../../../core/services/staff-member.service'
import { OfficeService } from '../../../core/services/office.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-valuations-list-page-shell',
  template: `
    <app-pure-valuations-list-page-shell
      [valuerOptions]="valuersForSelect"
      [officeOptions]="statuses"
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
  queryResultCount: number

  searchModel: {
    searchTerm: ''
    suggestedTerm: ''
    date: ''
    status: [0]
    valuerId: [0]
    officeId: [0]
    orderBy: '-valuationDate'
    page: 1
    pageSize: 20
  }

  selectControlModels = {
    status: [],
    valuerId: [],
    officeId: []
  }
  searchStats: any = {}

  public keepOriginalOrder = (a) => a.key

  onSearchModelChanges(ev) {
    console.log('onSearchModelChanges: ', ev)
    this.searchModel = {
      ...this.searchModel,
      ...ev
    }
    console.log('merged searchModel: ', this.searchModel)
  }

  constructor(
    private _valuationFacadeSvc: ValuationFacadeService,
    private staffMemberService: StaffMemberService,
    private officeService: OfficeService,
    private storage: StorageMap,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    super()
  }
  currentStaffMember: StaffMember

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
    this._valuationFacadeSvc
      .getValuations(this.searchModel)
      .pipe(distinctUntilChanged())
      .subscribe(
        (result) => {
          if (this.searchModel.searchTerm) {
            if (result && !result.length) {
              this.isMessageVisible = true
              this.bottomReached = true
            } else {
              this.isMessageVisible = false
            }
          }
          if (result && result.length) {
            this.queryResultCount = result[0].queryResultCount
            if (this.searchModel.page === 1) {
              this.isAdvancedSearchVisible = false
              this.valuations = result
            } else {
              this.valuations = this.valuations.concat(result)
            }
          } else {
            this.queryResultCount = 0
          }
        },
        (error: WedgeError) => {
          console.error('error: ', error)
          this.valuations = []
          this.searchModel.searchTerm = ''
          this.isHintVisible = true
        }
      )
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

  // PRIVATE
  // private setPage() {
  //   this._valuationFacadeSvc.valuationPageNumberChanges$
  //     .pipe(takeUntil(this.ngUnsubscribe))
  //     .subscribe((newPageNumber) => {
  //       this.page = newPageNumber
  //       this.getNextValuationsPage(this.page)
  //       // console.log("%c HEYYYY", "color: blue", this.page);
  //     })
  // }

  private getCurrentStaffMember() {
    this.staffMemberService
      .getCurrentStaffMember()
      .toPromise()
      .then((res) => {
        this.currentStaffMember = res
        // this.setInitialFilters()
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
