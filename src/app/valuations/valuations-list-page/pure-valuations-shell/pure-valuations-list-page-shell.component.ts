import { Component, Input, Output, EventEmitter } from '@angular/core'
import { StaffMember } from 'src/app/shared/models/staff-member'
import { Valuation } from '../../shared/valuation'

@Component({
  selector: 'app-pure-valuations-list-page-shell',
  template: `
    <div class="row">
      <app-valuations-search
        [searchStats]="searchStats"
        [searchModel]="searchModel"
        [valuerOptions]="valuerOptions"
        [statusOptions]="statusOptions"
        [officeOptions]="officeOptions"
        [currentStaffMember]="currentStaffMember"
        (onGetValuations)="onGetValuations.emit($event)"
        (onSearchModelChanges)="onSearchModelChanges.emit($event)"
      ></app-valuations-search>

      <app-valuations-list
        *ngIf="!isHintVisible"
        [page]="searchModel.page"
        [valuations]="valuations"
        [bottomReached]="bottomReached"
        (onScrollDown)="onScrollDown.emit($event)"
        (onNavigateTo)="onNavigateTo.emit($event)"
      ></app-valuations-list>
    </div>
  `
})
export class PureValuationsListPageShellComponent {
  @Input() valuations: Valuation[]
  @Input() valuerOptions: any[]
  @Input() statusOptions: any[]
  @Input() officeOptions: any[]
  @Input() isMessageVisible: boolean
  @Input() isHintVisible: boolean
  @Input() bottomReached: boolean
  @Input() searchModel: any
  @Input() searchStats: any
  @Input() currentStaffMember: StaffMember

  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetValuations: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
  @Output() onNavigateTo: EventEmitter<any> = new EventEmitter()
}
