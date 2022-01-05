import { Component, OnInit } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Observable } from 'rxjs'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { StaffMember } from 'src/app/shared/models/staff-member'
import { InstructionsStoreState, InstructionsTableType } from '../../instructions.interfaces'
import { InstructionsStore } from '../../instructions.store'

@Component({
  selector: 'app-instructions-list-page-shell',
  template: `
    <app-pure-instructions-list-page-shell
      [vm]="vm$ | async"
      [currentStaffMember]="currentStaffMember"
      (onGetInstructions)="store.fetchInstructions($event)"
      (onNavigateToInstruction)="onNavigateToInstruction($event)"
      (onSortClicked)="onSortClicked($event)"
      (onScrollDown)="store.fetchNextPage()"
      (onSearchModelChanges)="updateSearchModel($event)"
    ></app-pure-instructions-list-page-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent implements OnInit {
  vm$: Observable<InstructionsStoreState>
  currentStaffMember: StaffMember

  constructor(
    public store: InstructionsStore,
    private staffMemberService: StaffMemberService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {
    this.vm$ = this.store.instructionsVm$

    this.store.fetchInstructions({
      departmentType: InstructionsTableType.SALES_AND_LETTINGS
    })
  }

  ngOnInit() {
    this.getCurrentStaffMember()
  }

  onNavigateToInstruction(val: any) {
    // TODO wire this up when detail page built
    // this.router.navigate(['detail', val?.instructionId], { relativeTo: this.activatedRoute })
  }

  onSortClicked(columnName) {
    this.store.onSortColumnClick(columnName)
    this.store.fetchInstructions()
  }

  updateSearchModel(ev) {
    this.store.updateSearchModel(ev)
  }

  private getCurrentStaffMember() {
    this.staffMemberService
      .getCurrentStaffMember()
      .toPromise()
      .then((res) => {
        this.currentStaffMember = res
      })
  }
}
