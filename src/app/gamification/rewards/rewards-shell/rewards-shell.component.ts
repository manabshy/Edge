import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { RewardsService } from 'src/app/gamification/rewards/rewards.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { combineLatest, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/models/base-component';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';

@Component({
  selector: 'app-rewards-shell',
  template: `
    <div *ngIf="streak && bonus && swagBag" class="">
      <app-rewards-toolbar [connectionStatus]="connectionStatus"  [swagBag]="swagBag" [streak]="streak"></app-rewards-toolbar>
      <ng-container *ngFor="let b of bonus">
        <app-rewards-row [streak]="streak" [bonus]="b"></app-rewards-row>
      </ng-container>
    </div>
  `
})
export class RewardsShellComponent extends BaseComponent implements OnInit, OnDestroy {
  swagBag: any;
  streak: any;
  bonus: any;
  connectionStatus: any;
  currentStaffMember: any;
  connectionClosed = false;

  constructor(
    private staffMemberService: StaffMemberService,
    private storage: StorageMap,
    private cdRef: ChangeDetectorRef,
    private signalRService: SignalRService,
    private rewardsService: RewardsService) {
    super();

    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.prepareSignalR(signalRService, data);
      } else {
        this.staffMemberService.getCurrentStaffMember().subscribe((data) => {
          this.prepareSignalR(signalRService, data);
        });
      }
    })
  }

  prepareSignalR(signalRService, currentStaffMember) {
    this.currentStaffMember = currentStaffMember;
    signalRService.startConnection(this.currentStaffMember);
    signalRService.hubConnection.onclose((err: Error) => {
      if (!this.connectionClosed) {
        signalRService.hubConnectionOnclose(err, this.currentStaffMember);
      }
    })
  }

  ngOnDestroy(): void {
    this.connectionClosed = true;
    this.signalRService.disconnect();
  }

  ngOnInit(): void {

    this.signalRService.connectionStatus$.subscribe(status => {
      this.connectionStatus = status;
    });

    combineLatest([
      this.rewardsService.getBonuses(),
      this.signalRService.getBonusesStream$
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([api, signalR]) => {
      this.bonus = signalR ? signalR : api;
      this.cdRef.detectChanges();
    });

    combineLatest([
      this.rewardsService.getStreak(),
      this.signalRService.getStreakStream$
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([api, signalR]) => {
      this.streak = signalR ? signalR : api;
      this.cdRef.detectChanges();
    });

    combineLatest([
      this.rewardsService.getSwagBag(),
      this.signalRService.getSwagBagStream$
    ]).pipe(takeUntil(this.ngUnsubscribe)).subscribe(([api, signalR]) => {
      this.swagBag = signalR ? signalR : api;
      this.cdRef.detectChanges();
    });
  }
}


