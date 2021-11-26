import { Component, OnInit, Input, OnChanges, HostListener, OnDestroy } from '@angular/core'
import { Valuation, ValuationStatusEnum } from '../shared/valuation'
import { ValuationFacadeService } from '../shared/valuation-facade.service'
import { Router, ActivatedRoute } from '@angular/router'

@Component({
  selector: 'app-valuation-list',
  templateUrl: './valuation-list.component.html',
  styleUrls: ['./valuation-list.component.scss']
})
export class ValuationListComponent implements OnInit, OnChanges, OnDestroy {
  @Input() valuations: Valuation[]
  @Input() searchTerm: string
  @Input() bottomReached: boolean
  @Input() pageNumber: number
  page: number

  constructor(
    private _valuationFacadeSvc: ValuationFacadeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.valuations) {
      // console.log('valuations', this.valuations)
      this.valuations.forEach((x) => {
        x.valuationStatusLabel = ValuationStatusEnum[x.valuationStatus]
      })
    }
    this.page = this.pageNumber
  }

  navigateTo(val: Valuation) {
    let path = ['detail', val?.valuationEventId, 'edit']
    if (val.valuationStatus === ValuationStatusEnum.Cancelled || val.valuationStatus === ValuationStatusEnum.Closed) {
      path = ['detail', val?.valuationEventId, 'cancelled']
    } else if (val.valuationStatus === ValuationStatusEnum.Instructed) {
      path = ['detail', val?.valuationEventId, 'instructed']
    }
    this.router.navigate(path, { relativeTo: this.activatedRoute })
  }

  onScrollDown() {
    this.onWindowScroll()
    // console.log('scrolled')
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let scrollHeight: number, totalHeight: number
    scrollHeight = document.body.scrollHeight
    totalHeight = window.scrollY + window.innerHeight
    const url = this.router.url
    const isValuationsRegister = url.endsWith('/valuations')

    if (isValuationsRegister) {
      if (totalHeight >= scrollHeight && !this.bottomReached) {
        // console.log('%c first request NOOOOO', 'color:green', this.page)
        if (this.valuations && this.valuations.length) {
          this.page++
          // console.log('%c Not first request', 'color:purple', this.page)
          this._valuationFacadeSvc.valuationPageNumberChanged(this.page)
          // console.log('valuations page number', this.page)
        }
      }
    }
  }

  getStatusColor(valuation: Valuation) {
    if (valuation) {
      if (valuation.valuationStatus == ValuationStatusEnum.Booked) return '#4DA685'
      else if (valuation.valuationStatus == ValuationStatusEnum.Cancelled) {
        return '#E02020'
      } else if (valuation.valuationStatus == ValuationStatusEnum.Instructed) {
        return '#0A1A4A'
      } else if (valuation.valuationStatus == ValuationStatusEnum.Valued) {
        return '#3498DB'
      } else if (valuation.valuationStatus == ValuationStatusEnum.Closed) {
        return '#FFB134'
      }
    }
  }

  ngOnDestroy() {
    this._valuationFacadeSvc.valuationPageNumberChanged(0)
    // console.log('%c on destroy ', 'color:blue', this.page)
  }
}
