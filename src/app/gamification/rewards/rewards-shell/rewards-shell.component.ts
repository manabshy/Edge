import { Component, Input, OnDestroy, OnInit } from '@angular/core'
import { RewardsService } from 'src/app/gamification/rewards/rewards.service';
import { SignalRService } from 'src/app/core/services/signal-r.service';
import { BehaviorSubject, combineLatest, Observable, of } from 'rxjs'
import { filter, map, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'app-rewards-shell',
  template: `
    <div class="">
      <app-rewards-toolbar [connectionStatus$]="signalRService.connectionStatus$"  [swagBag$]="swagBag$" [streak$]="streak$"></app-rewards-toolbar>
      <ng-container *ngFor="let b of bonus$ | async">
        <app-rewards-row [streak$]="streak$" [bonus]="b"></app-rewards-row>
      </ng-container>
    </div>
  `
})
export class RewardsShellComponent implements OnInit, OnDestroy {
  swagBag$: any;
  streak$: any;
  bonus$: any;

  public hasConnectionProblemBefore = false;
  private connectionClosed = false;

  private $: BehaviorSubject<any> = new BehaviorSubject(null);;

  private onReconnectionSwagBagStream: BehaviorSubject<any> = new BehaviorSubject(null);
  public onReconnectionSwagBagStream$ = this.onReconnectionSwagBagStream.asObservable();

  constructor(public signalRService: SignalRService, public rewardsService: RewardsService) {
    signalRService.startConnection();

    signalRService.hubConnection.onclose((err: Error) => {
      if(!this.connectionClosed) {
        signalRService.hubConnectionOnclose(err);
      }
    });
   }


  ngOnDestroy(): void {
    this.connectionClosed = true;
    this.signalRService.disconnect();
  }

  ngOnInit(): void {

    this.swagBag$ = combineLatest([
      this.rewardsService.getSwagBag(),
      this.signalRService.getSwagBagStream$,
    ]).pipe(
      map(([api, signalR]) => {
        return signalR ? signalR : api;
      }));

    this.streak$ = combineLatest([
      this.rewardsService.getStreak(),
      this.signalRService.getStreakStream$
    ]).pipe(
      map(([api, signalR]) => {
        return signalR ? signalR : api;
      }));

    this.bonus$ = combineLatest([
      this.rewardsService.getBonuses(),
      this.signalRService.getBonusesStream$
    ]).pipe(
      map(([api, signalR]) => {
        return signalR ? signalR : api;
      }));
  }
}


