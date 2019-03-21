import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Leaderboard } from '../shared/leaderboard';

import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit {
  @Input() exchanges: Leaderboard[];
  sortedExchanges: any[];
  @Input() selectedPeriod: string; 
  order: string = 'totalFees';
  reverse: boolean = true;

  constructor(private orderPipe: OrderPipe) {
    this.sortedExchanges = orderPipe.transform(this.exchanges, 'totalFees');
  }

  ngOnInit() {}

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = true;
    }

    this.order = value;
  }
}
