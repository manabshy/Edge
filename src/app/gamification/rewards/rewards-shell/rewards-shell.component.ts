import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core'
import { RewardsService } from 'src/app/gamification/rewards/rewards.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { combineLatest, takeUntil } from 'rxjs';
import { BaseComponent } from 'src/app/shared/models/base-component';

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
  connectionStatus : any;

  connectionClosed = false;

  constructor(private cdRef: ChangeDetectorRef, public signalRService: SignalRService, public rewardsService: RewardsService) {
    super();

    signalRService.startConnection();

    signalRService.hubConnection.onclose((err: Error) => {
      if (!this.connectionClosed) {
        signalRService.hubConnectionOnclose(err);
      }
    });
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


