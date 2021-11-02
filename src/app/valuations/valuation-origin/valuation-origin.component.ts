import { DashboardMember } from 'src/app/shared/models/dashboard-member'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { InfoDetail } from 'src/app/core/services/info.service'
import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { Valuation } from '../shared/valuation'
import { Observable, of, Subscription } from 'rxjs'
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member'
import { StaffMember } from 'src/app/shared/models/staff-member'

@Component({
  selector: 'app-valuation-origin',
  templateUrl: './valuation-origin.component.html',
  styleUrls: ['./valuation-origin.component.scss']
})
export class ValuationOriginComponent implements OnInit, AfterViewInit {
  @Input() valuation: Valuation
  @Input() leadTypeId: number
  @Input() isClientService: boolean = false
  @Input() allOrigins: InfoDetail[]
  @Input() allOriginTypes: InfoDetail[]
  bookByOptions$: Observable<StaffMember[]>
  origins: InfoDetail[]
  bookedByErrorMessage: string = null
  originIdMessage: string = null

  constructor(private staffMembersService: StaffMemberService) {
    this.bookByOptions$ = this.staffMembersService.getCsStaffMembers()
  }

  ngOnInit(): void {
    if (!(this.valuation.originId && this.valuation.originId > 0)) {
      if (this.leadTypeId == 1) {
        this.setOriginTypeId(14)
        this.valuation.originId = 125
      } else if (this.leadTypeId == 17) {
        this.setOriginTypeId(14)
        this.valuation.originId = 146
      } else if (this.leadTypeId == 3 || this.leadTypeId == 4 || this.leadTypeId == 6) {
        this.setOriginTypeId(14)
        if (this.isClientService) {
          this.valuation.originId = 145
        } else {
          this.valuation.originId = 126
        }
      } else if (this.leadTypeId == 9) {
        this.setOriginTypeId(14)
        this.valuation.originId = 127
      } else if (
        this.leadTypeId == 5 ||
        this.leadTypeId == 2 ||
        this.leadTypeId == 15 ||
        this.leadTypeId == 14 ||
        this.leadTypeId == 8 ||
        this.leadTypeId == 10 ||
        this.leadTypeId == 11 ||
        this.leadTypeId == 12 ||
        this.leadTypeId == 13 ||
        this.leadTypeId == 16
      ) {
        if (this.isClientService) {
          this.setOriginTypeId(12)
          this.valuation.originId = 126
        } else {
          this.setOriginTypeId(14)
          this.valuation.originId = 126
        }
      } else if (this.leadTypeId == 7) {
        this.setOriginTypeId(12)
        this.valuation.originId = 122
      } else {
        this.setOriginTypeId(this.allOrigins[0].parentId)
      }
    } else {
      let originType = this.allOrigins.find((x) => x.id == this.valuation.originId)
      this.setOriginTypeId(originType.parentId)
      this.controlValues()
    }
  }

  ngAfterViewInit(): void {}

  setOriginTypeId(originTypeId: number) {
    if (originTypeId) {
      this.valuation.originTypeId = originTypeId
      this.origins = this.allOrigins.filter((x) => x.parentId == originTypeId && x.isActive === true)
      this.origins.unshift({ id: 0, value: ' ' })
    }
  }

  controlValues() {
    if (this.valuation.originTypeId == 13 || this.valuation.originTypeId == 14) {
      if (!this.valuation.bookedBy) this.bookedByErrorMessage = 'Booked by field is required'
      else this.bookedByErrorMessage = null
    } else {
      this.valuation.bookedBy = null
    }

    if (!(this.valuation.originId > 0)) this.originIdMessage = 'Origin field is required'
    else this.originIdMessage = null
  }
  originTypeIdChanged(value) {
    this.valuation.originId = 0
    this.setOriginTypeId(value)
  }
}
