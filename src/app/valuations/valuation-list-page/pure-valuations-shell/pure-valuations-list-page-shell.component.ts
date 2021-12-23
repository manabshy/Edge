import { Component, Input, Output, EventEmitter } from '@angular/core'

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
        (onGetInstructions)="onGetInstructions.emit($event)"
        (onDepartmentChanged)="onDepartmentChanged.emit($event)"
        (onSearchModelChanges)="onSearchModelChanges.emit($event)"
      ></app-valuations-search>

      <app-valuations-list
        class="appWrapper"
        *ngIf="!isHintVisible"
        [pageNumber]="page"
        [valuations]="valuations"
        [bottomReached]="bottomReached"
        [searchTerm]="searchTerm"
        (onScrollDown)="onScrollDown.emit($event)"
      ></app-valuations-list>
    </div>
  `
})
export class PureValuationsListPageShellComponent {
  @Input() valuations: any[]
  @Input() valuerOptions: any[]
  @Input() statusOptions: any[]
  @Input() officeOptions: any[]
  @Input() isMessageVisible: boolean
  @Input() isHintVisible: boolean
  @Input() bottomReached: boolean
  @Input() page: number
  @Input() searchTerm: string

  @Output() onNavigateToInstruction: EventEmitter<any> = new EventEmitter()
  @Output() onGetInstructions: EventEmitter<any> = new EventEmitter()
  @Output() onDepartmentChanged: EventEmitter<any> = new EventEmitter()
  @Output() onSearchModelChanges: EventEmitter<any> = new EventEmitter()
  @Output() onSortClicked: EventEmitter<any> = new EventEmitter()
  @Output() onScrollDown: EventEmitter<any> = new EventEmitter()
}
