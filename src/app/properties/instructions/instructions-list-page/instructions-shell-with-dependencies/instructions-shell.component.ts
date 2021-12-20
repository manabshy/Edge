import { Component } from '@angular/core'
import { Observable } from 'rxjs'
import { InstructionsStore } from '../../instructions.store'
import { StorageMap } from '@ngx-pwa/local-storage'
import { StaffMember } from 'src/app/shared/models/staff-member'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { InstructionStatus } from '../../instructions.interfaces'
import { OfficeService } from 'src/app/core/services/office.service'

// [searchSuggestions$]="store.searchSuggestions$"
@Component({
  selector: 'app-instructions-list-page-shell',
  template: `
    <app-pure-instructions-list-page-shell
      [vm]="store.instructionsVm$ | async"
      [valuerOptions]="valuersForSelect"
      [statusOptions]="statusesForSelect"
      [officeOptions]="officesForSelect"
      (onGetInstructions)="store.getInstructions($event)"
    ></app-pure-instructions-list-page-shell>
  `,
  providers: [InstructionsStore]
})
export class InstructionsShellComponent {
  vm$: Observable<any>
  valuers: StaffMember[]
  valuersForSelect: Array<any> = []
  statusesForSelect: any[]
  officesForSelect: any[]
  instructionStatus = InstructionStatus

  constructor(
    public store: InstructionsStore,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService,
    private officeService: OfficeService
  ) {
    this.statusesForSelect = Object.keys(this.instructionStatus).map((statusVal, ix) => {
      return {
        id: statusVal,
        value: this.instructionStatus[statusVal]
      }
    })

    console.log('InstructionShellComponent constructor')
    this.vm$ = this.store.instructionsVm$
  }

  ngOnInit() {
    this.getValuers()
    this.getOffices()
  }

  private getOffices() {
    this.officeService
      .getOffices()
      .toPromise()
      .then((res) => {
        this.officesForSelect = res.result.map((office) => {
          return {
            id: office.officeId,
            value: office.name
          }
        })
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
          // .pipe(takeUntil(this.ngUnsubscribe))
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
}
