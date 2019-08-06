import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Leaderboard } from '../shared/leaderboard';

import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.scss']
})
export class ExchangesComponent implements OnInit, OnChanges {
  @Input() exchanges: Leaderboard[];
  @Input() selectedPeriodLabel: string;
  sortedExchanges: any[];
  order: string = 'totalFees';
  reverse: boolean = true;

  constructor(private orderPipe: OrderPipe) {
    this.sortedExchanges = orderPipe.transform(this.exchanges, 'totalFees');
  }

  ngOnInit() {
    console.log('exchange', this.exchanges);
    console.log('selected label', this.selectedPeriodLabel);
  }

  ngOnChanges(){
    console.log('exchange 1', this.exchanges);
    console.log('selected label 1', this.selectedPeriodLabel);
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = true;
    }

    this.order = value;
  }
}
