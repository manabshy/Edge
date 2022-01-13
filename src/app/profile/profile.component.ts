import { Component, OnInit, Input } from '@angular/core'
import { StorageMap } from '@ngx-pwa/local-storage'
import { MenuItem } from 'primeng/api'
import { DynamicDialogRef } from 'primeng/dynamicdialog'
import { AuthService } from '../core/services/auth.service'
import { StaffMemberService } from '../core/services/staff-member.service'
import { BaseStaffMember } from '../shared/models/base-staff-member'
import { StaffMember } from '../shared/models/staff-member'

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html'
})
export class ProfileComponent implements OnInit {
  @Input() iconColorClass?: string = 'text-gray-900'
  currentStaffMember: StaffMember
  navTitle: string
  headerLabel: string
  showImpersonation = false
  impersonatedStaffMember: BaseStaffMember
  ref: DynamicDialogRef
  isImpersonating = false
  menuItems: MenuItem[]

  constructor(
    public authService: AuthService,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService
  ) {}

  ngOnInit(): void {
    this.storage.get('impersonatedStaffMember').subscribe((staffMember: BaseStaffMember) => {
      if (staffMember) {
        this.impersonatedStaffMember = staffMember
        this.isImpersonating = true
      }
      this.menuItems = this.setMenuItems()
    })

    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe((res) => {
          this.currentStaffMember = res
          this.menuItems = this.setMenuItems()
        })
      }
      this.menuItems = this.setMenuItems()
    })
  }

  private setMenuItems() {
    const items = []
    if (this.currentStaffMember?.canImpersonate || this.isImpersonating) {
      if (!this.isImpersonating) {
        items.push({
          id: 'impersonate',
          label: 'Impersonate',
          icon: 'fa fa-user-shield',
          command: () => {
            this.impersonate()
          }
        })
      }
      if (this.isImpersonating) {
        items.push({
          id: 'stopImpersonation',
          label: 'Stop Impersonation',
          icon: 'fa fa-user-shield',
          command: () => {
            this.impersonate(true)
          }
        })
      }
      if (this.currentStaffMember) {
        items.push({
          id: 'logout',
          label: 'Logout',
          icon: 'fa fa-sign-out-alt',
          command: () => {
            this.logOut()
          }
        })
      }
      if (!this.currentStaffMember) {
        items.push({
          id: 'login',
          label: 'Login',
          icon: 'fa fa-sign-in-alt',
          command: () => {
            this.logIn()
          }
        })
      }
    }

    return items
  }

  logIn() {
    this.authService.login()
  }

  logOut() {
    this.authService.logout()
  }

  impersonate(stop = false) {
    console.log({ stop })
    if (stop) {
      this.showImpersonation = false
      this.isImpersonating = false
      this.storage.delete('signature').subscribe()
      localStorage.removeItem('impersonatedStaffMemberId')
      localStorage.removeItem('listingType')
      this.storage.delete('impersonatedStaffMember').subscribe()
      this.resetCurrentUser()
    } else {
      this.showImpersonation = true
    }
  }

  private resetCurrentUser() {
    this.storage.get('originalUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data
        this.storage.set('currentUser', data).subscribe(() => {
          this.storage.delete('originalUser').subscribe()
          location.reload()
        })
      }
    })
  }

  getSelectedStaffMember(member: BaseStaffMember) {
    this.impersonatedStaffMember = member
  }

  startImpersonation() {
    this.storage.set('originalUser', this.currentStaffMember).subscribe()
    this.storage.delete('currentUser').subscribe()
    this.storage.delete('signature').subscribe()
    localStorage.removeItem('listingType')
    this.isImpersonating = true
    this.showImpersonation = false

    this.storage.set('impersonatedStaffMember', this.impersonatedStaffMember).subscribe()
    localStorage.setItem('impersonatedStaffMemberId', JSON.stringify(this.impersonatedStaffMember.staffMemberId))
    this.staffMemberService.impersonatedStaffMemberChanged(this.impersonatedStaffMember)
  }
}
