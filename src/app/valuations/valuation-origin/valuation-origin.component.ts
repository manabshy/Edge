import { DashboardMember } from 'src/app/shared/models/dashboard-member'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { InfoDetail } from 'src/app/core/services/info.service'
import { Component, Input, OnInit } from '@angular/core'
import { Valuation } from '../shared/valuation'
import { Observable, Subscription } from 'rxjs'

@Component({
  selector: 'app-valuation-origin',
  templateUrl: './valuation-origin.component.html',
  styleUrls: ['./valuation-origin.component.scss']
})
export class ValuationOriginComponent implements OnInit {
  @Input() valuation: Valuation
  @Input() leadTypeId: number
  @Input() originId: number
  bookByOptions$: Observable<DashboardMember[]>
  originIdOptions: InfoDetail[]
  //bookByOptions: InfoDetail[];
  originErrorMessage: string = null
  bookedByErrorMessage: string = null
  bookOptionsSubscription: Subscription = new Subscription()

  constructor(private staffMembersService: StaffMemberService) {
    this.bookByOptions$ = this.staffMembersService.getCsStaffMembers()
  }

  ngOnInit(): void {}

  onBookedByChanged(event: any) {}
  onOriginIdChanged(event: any) {}
  controlValues() {}
}
