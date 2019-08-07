import { Component, OnInit, Input, EventEmitter, Output, OnChanges } from '@angular/core';
import { LeaderboardSort } from '../shared/leaderboard';
import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-leaderboard-tabs',
  templateUrl: './leaderboard-tabs.component.html',
  styleUrls: ['./leaderboard-tabs.component.scss']
})
export class LeaderboardTabsComponent implements OnInit, OnChanges {
  @Input() tabs: any;
  @Input() active: any;
  @Input() managedOrFees: any;
  @Input() data: any[];
  @Output() tabChange: EventEmitter<any> = new EventEmitter<any>();
  order = 'totalFees';
  reverse = true;
  leaderboardSort = LeaderboardSort;
  sortedData: any[];
 
  constructor(private orderPipe: OrderPipe) {this.sortedData = orderPipe.transform(this.data, 'totalFees'); }

  ngOnInit() {
    console.log('data in ngOnInit changes in child', this.data);
  }

  ngOnChanges() {
    console.log('data in ng changes in child', this.data);
  }

  changeTab(value) {
    this.active = value;
    this.tabChange.emit(value);
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
