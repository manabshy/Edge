import { DashboardMember } from 'src/app/shared/models/dashboard-member'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { InfoDetail } from 'src/app/core/services/info.service'
import { AfterViewInit, Component, Input, OnInit } from '@angular/core'
import { Valuation } from '../shared/valuation'
import { Observable, of, Subscription } from 'rxjs'
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member'
import { StaffMember } from 'src/app/shared/models/staff-member'
import { StorageMap } from '@ngx-pwa/local-storage'

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
  bookByOptions: StaffMember[] = []
  subscriptions = new Subscription()
  origins: InfoDetail[]
  bookedByErrorMessage: string = null
  originIdMessage: string = null

  constructor(private staffMembersService: StaffMemberService, private storage: StorageMap) {}

  ngOnInit(): void {
    if (
      !(this.valuation.originId && this.valuation.originId > 0) &&
      !(this.valuation.originTypeId && this.valuation.originTypeId > 0)
    ) {
      if (this.leadTypeId == 18) {
        this.setOriginTypeId(14)
        this.valuation.originId = 137
      } else if (this.leadTypeId == 1) {
        this.setOriginTypeId(14)
        this.valuation.originId = 125
      } else if (this.leadTypeId == 17) {
        this.setOriginTypeId(14)
        this.valuation.originId = 146
      } else if (this.leadTypeId == 3) {
        if (this.isClientService) {
          this.setOriginTypeId(14)
          this.valuation.originId = 145
        } else {
          this.setOriginTypeId(12)
          this.valuation.originId = 5
        }
      } else if (
        this.leadTypeId == 5 ||
        this.leadTypeId == 2 ||
        this.leadTypeId == 15 ||
        this.leadTypeId == 14 ||
        this.leadTypeId == 12 ||
        this.leadTypeId == 13 ||
        this.leadTypeId == 4 ||
        this.leadTypeId == 6 ||
        this.leadTypeId == 8
      ) {
        if (this.isClientService) {
          this.setOriginTypeId(14)
          this.valuation.originId = 126
        } else {
          this.setOriginTypeId(12)
          this.valuation.originId = 5
        }
      } else if (this.leadTypeId == 10 || this.leadTypeId == 11) {
        if (this.isClientService) {
          this.setOriginTypeId(14)
          this.valuation.originId = 129
        } else {
          this.setOriginTypeId(12)
          this.valuation.originId = 5
        }
      } else if (this.leadTypeId == 7) {
        this.setOriginTypeId(12)
        this.valuation.originId = 58
      } else {
        this.allOrigins = this.allOrigins.filter((x) => x.isActive == true)
        if (this.allOrigins && this.allOrigins.length > 0) this.setOriginTypeId(this.allOrigins[0].parentId)
      }
    } else {
      if (this.valuation.originTypeId > 0) this.setOriginTypeId(this.valuation.originTypeId)
      else {
        let originType = this.allOrigins.find((x) => x.id == this.valuation.originId)
        if (originType) this.setOriginTypeId(originType.parentId)
        else this.setOriginTypeId(12)
      }

      this.controlValues()
    }

    this.subscriptions = this.staffMembersService.getCsStaffMembers().subscribe((data) => {
      this.bookByOptions = data
      if (
        this.valuation &&
        this.valuation.bookedById > 0 &&
        !this.bookByOptions.some((x) => x.staffMemberId == this.valuation.bookedById)
      ) {
        this.storage.get('allstaffmembers').subscribe((dataStaffMembers: StaffMember[]) => {
          if (dataStaffMembers) {
            this.bookByOptions.unshift(dataStaffMembers.find((x) => x.staffMemberId == this.valuation.bookedById))
            this.bookByOptions = [...this.bookByOptions]
            // let bookedById = this.valuation.bookedById
            // this.valuation.bookedById = null
            // this.valuation.bookedById = bookedById
          }
        })
      }
    })
  }

  ngAfterViewInit(): void {}

  setOriginTypeId(originTypeId: number) {
    if (originTypeId) {
      this.valuation.originTypeId = originTypeId
      if (this.allOrigins.some((x) => x.parentId == originTypeId && x.isActive === true) == false) {
        this.origins = this.allOrigins.filter((x) => x.parentId == originTypeId)
      } else {
        this.origins = this.allOrigins.filter((x) => x.parentId == originTypeId && x.isActive === true)
      }

      if (this.valuation.originId > 0 && this.origins.findIndex((x) => x.id == this.valuation.originId) === -1) {
        this.origins.unshift(this.allOrigins.find((x) => x.id == this.valuation.originId))
      }

      this.origins.unshift({ id: 0, value: ' ' })
    }
  }

  controlValues() {
    if (this.valuation.originTypeId == 13 || this.valuation.originTypeId == 14) {
      if (!(this.valuation.bookedById && this.valuation.bookedById > 0))
        this.bookedByErrorMessage = 'Booked by field is required'
      else {
        this.bookedByErrorMessage = null
        this.staffMembersService.getStaffMember(this.valuation.bookedById)
        this.valuation.bookedBy = this.staffMembersService.selectedStaffMemberBs.getValue()
      }
    } else {
      this.valuation.bookedById = null
    }

    if (!(this.valuation.originId > 0)) this.originIdMessage = 'Origin field is required'
    else this.originIdMessage = null
  }
  originTypeIdChanged(value) {
    this.valuation.originId = 0
    this.setOriginTypeId(value)
  }
}
