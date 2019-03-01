import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Leaderboard } from '../shared/leaderboard';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit, OnChanges {
  @Input() exchanges: Leaderboard[];
  @Input() selectedPeriod: string;

  constructor() {}
  ngOnChanges(changes: SimpleChanges): void {
    for (const myKeys of Object.keys(changes)) {
      console.log(changes[myKeys].currentValue);
    }
  }
  ngOnInit() {}
}
