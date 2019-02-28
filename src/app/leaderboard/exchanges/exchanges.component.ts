import { Component, OnInit, Input } from '@angular/core';
import { Leaderboard } from '../shared/leaderboard';

@Component({
  selector: 'app-exchanges',
  templateUrl: './exchanges.component.html',
  styleUrls: ['./exchanges.component.css']
})
export class ExchangesComponent implements OnInit {
@Input() exchanges: Leaderboard[];
  constructor() { }

  ngOnInit() {
  }

}
