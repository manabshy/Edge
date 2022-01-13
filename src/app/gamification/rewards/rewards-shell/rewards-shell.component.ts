import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { RewardsService } from 'src/app/gamification/rewards/rewards.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { Subject, takeUntil } from 'rxjs';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-rewards-shell',
  template: `
    <app-rewards-welcome class="animate__animated animate__fadeOut" *ngIf="showWelcome" (onSave)="saveUserRewardsIcon($event)"></app-rewards-welcome>
    <div *ngIf="streak && bonus && swagBag && !showWelcome" class="">
      <app-rewards-toolbar [isConnectionLost]="isConnectionLost"  [swagBag]="swagBag" [streak]="streak"></app-rewards-toolbar>
      <ng-container *ngFor="let b of bonus">
        <app-rewards-row [streak]="streak" [bonus]="b"></app-rewards-row>
      </ng-container>
    </div>
  `
})
export class RewardsShellComponent  implements OnInit, OnDestroy {
  ngUnsubscribe = new Subject<void>();

  swagBag: any;
  streak: any;
  bonus: any;
  isConnectionLost : any;
  showWelcome = true
  connectionClosed = false;

  constructor(
    private staffMemberService: StaffMemberService,
    private storage: StorageMap,
    private cdRef: ChangeDetectorRef,
    private signalRService: SignalRService,
    private rewardsService: RewardsService) {
 

    this.storage.get('currentUser').pipe(takeUntil(this.ngUnsubscribe)).subscribe((data: StaffMember) => {
      if (data) {
        this.prepareSignalR(signalRService, data);
      } else {
        this.staffMemberService.getCurrentStaffMember().pipe(takeUntil(this.ngUnsubscribe)).subscribe((data) => {
          this.prepareSignalR(signalRService, data);
        });
      }
    })
  }

  prepareSignalR(signalRService, currentStaffMember) {
    signalRService.startConnection(currentStaffMember);
    signalRService.hubConnection.onclose((err: Error) => {
      if (!this.connectionClosed) {
        signalRService.hubConnectionOnclose(err, currentStaffMember);
      }
    })
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();

    this.connectionClosed = true;
    this.signalRService.disconnect();
  }

  ngOnInit(): void {

    this.signalRService.connectionStatus$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(isConnectionLost => {

      if (isConnectionLost !== null && this.isConnectionLost !== isConnectionLost) {

        if (!isConnectionLost) {
          this.rewardsService.sync().pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
            if (data) {
              const syncResult = data.streakSyncResult && data.bonusSyncResult && data.swagBagSyncResult;
              this.isConnectionLost = syncResult;
            }
          });
        }
        this.isConnectionLost = isConnectionLost;
      }

    });

    this.signalRService.getBonusesStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.bonus = data;
      this.cdRef.detectChanges();
    });

    this.signalRService.getStreakStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.streak = data;
      this.cdRef.detectChanges();
    });


    this.signalRService.getSwagBagStream$.pipe(takeUntil(this.ngUnsubscribe)).subscribe(data => {
      this.swagBag = data;
      this.cdRef.detectChanges();
    });
  }

  saveUserRewardsIcon(icon){
    console.log('saveUserRewardsIcon($event)', icon)
    this.showWelcome = false
  }
}


