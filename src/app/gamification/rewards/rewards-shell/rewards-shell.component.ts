import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core'
import { RewardsService } from 'src/app/gamification/rewards/rewards.service'
import { SignalRService } from 'src/app/core/services/signal-r.service'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { StaffMember } from 'src/app/shared/models/staff-member'
import { StorageMap } from '@ngx-pwa/local-storage'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'
import { CookieService } from 'src/app/core/services/cookies.service'

@Component({
  selector: 'app-rewards-shell',
  template: `
    <app-rewards-welcome
      *ngIf="showWelcome"
      (onSave)="saveUserRewardsIcon($event)"
    ></app-rewards-welcome>
    <div *ngIf="!showWelcome">
      <app-rewards-toolbar
        [isConnectionLost]="isConnectionLost"
        [swagBag]="swagBag"
        [streak]="streak"
        [phoneCall]="phoneCall"
        [icon]="userRewardsIcon"s
      ></app-rewards-toolbar>
      <ng-container *ngFor="let b of bonus">
        <app-rewards-row [streak]="streak" [bonus]="b" [countdown]="countdown"></app-rewards-row>
      </ng-container>
    </div>
  `
})
export class RewardsShellComponent implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>()

  swagBag: any
  streak: any
  bonus: any
  phoneCall: any;

  isConnectionLost: any
  showWelcome:boolean
  userRewardsIcon: string
  connectionClosed = false
  countdown: any
  constructor(
    private staffMemberService: StaffMemberService,
    private storage: StorageMap,
    private cdRef: ChangeDetectorRef,
    private signalRService: SignalRService,
    private rewardsService: RewardsService,
    private cookieService: CookieService
  ) {
    this.storage
      .get('currentUser')
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((data: StaffMember) => {
        if (data) {
          this.prepareSignalR(signalRService, data)
        } else {
          this.staffMemberService
            .getCurrentStaffMember()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data) => {
              this.prepareSignalR(signalRService, data)
            })
        }
      })
  }

  prepareSignalR(signalRService, currentStaffMember) {
    signalRService.startConnection(currentStaffMember)
    signalRService.hubConnection.onclose((err: Error) => {
      if (!this.connectionClosed) {
        signalRService.hubConnectionOnclose(err, currentStaffMember)
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next()
    this.ngUnsubscribe.complete()

    this.connectionClosed = true
    this.signalRService.disconnect()
  }

  ngOnInit(): void {

    this.signalRService.connectionStatus$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((isConnectionLost) => {
      if (isConnectionLost !== null && this.isConnectionLost !== isConnectionLost) {
        if (!isConnectionLost) {
          this.rewardsService
            .sync()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => {
              if (data) {
                this.isConnectionLost = false
                this.cdRef.detectChanges()
              }
            })
            this.rewardsService
            .getCountDown()
            .pipe(takeUntil(this.ngUnsubscribe))
            .subscribe((data: any) => {
              if (data) {
                console.log('cd', data)
                this.countdown = data?.result
                this.cdRef.detectChanges()
              }

            })
        }
        this.isConnectionLost = isConnectionLost
        this.cdRef.detectChanges()

      }
    })

    this.signalRService.getPhoneCallStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.phoneCall = data
        this.cdRef.detectChanges()
      }
    })

    this.signalRService.getBonusesStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.bonus = data
        this.cdRef.detectChanges()
      }
    })

    this.signalRService.getStreakStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.streak = data
        this.cdRef.detectChanges()
      }
    })

    this.signalRService.getSwagBagStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
      if (data) {
        this.swagBag = data
        this.cdRef.detectChanges()
      }
    })
    
   
    const hasRewardsIconCookie = this.cookieService.getCookie('userRewardsIcon')
    this.showWelcome = hasRewardsIconCookie ? false: true
    this.userRewardsIcon = hasRewardsIconCookie
  }

  saveUserRewardsIcon(icon) {
    this.cookieService.setCookie('userRewardsIcon', icon, 30)
    this.userRewardsIcon = icon
    this.showWelcome = false
  }
}
