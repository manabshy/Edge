import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { RewardsService } from 'src/app/gamification/rewards/rewards.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { combineLatest } from 'rxjs';

@Component({
  selector: 'app-rewards-shell',
  template: `
    <app-rewards-welcome class="animate__animated animate__fadeOut" *ngIf="showWelcome" (onSave)="saveUserRewardsIcon($event)"></app-rewards-welcome>
    <div *ngIf="streak && bonus && swagBag && !showWelcome" class="">
      <app-rewards-toolbar [connectionStatus]="connectionStatus"  [swagBag]="swagBag" [streak]="streak"></app-rewards-toolbar>
      <ng-container *ngFor="let b of bonus">
        <app-rewards-row [streak]="streak" [bonus]="b"></app-rewards-row>
      </ng-container>
    </div>
  `
})
export class RewardsShellComponent implements OnInit, OnDestroy {
  swagBag: any;
  streak: any;
  bonus: any;
  connectionStatus : any;
  showWelcome = true
  connectionClosed = false;

  constructor(public signalRService: SignalRService, public rewardsService: RewardsService) {
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
    ]).subscribe(([api, signalR]) => {
      this.bonus = signalR ? signalR : api;
    });

    combineLatest([
      this.rewardsService.getStreak(),
      this.signalRService.getStreakStream$
    ]).subscribe(([api, signalR]) => {
      this.streak = signalR ? signalR : api;
    });

    combineLatest([
      this.rewardsService.getSwagBag(),
      this.signalRService.getSwagBagStream$
    ]).subscribe(([api, signalR]) => {
      this.swagBag = signalR ? signalR : api;
    });
  }

  saveUserRewardsIcon(icon){
    console.log('saveUserRewardsIcon($event)', icon)
    this.showWelcome = false
  }
}


