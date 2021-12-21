import { Component, Input, OnInit } from '@angular/core';
import { SignalRService } from 'src/app/core/services/signal-r.service';

@Component({
    selector: 'app-shared-rewards',
    template: `<div *ngIf="data | async as d">{{d.rewardAmount}}</div>`
})
export class SharedRewardsComponent implements OnInit {

    data: any;

    constructor(private signalRService: SignalRService) {
        this.data = signalRService.messageStream$;
    }

    ngOnInit(): void {
    }

}
