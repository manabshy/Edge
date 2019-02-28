import { Component, OnInit } from '@angular/core';

import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard, LeaderboardResult, Period } from './shared/leaderboard';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
instructions: Leaderboard[] = [];
pipelineList: Leaderboard[] = [];
exchanges: Leaderboard[] = [];
leaderboardResult: LeaderboardResult;
resultCount: number;
period = Period.ThisYear;
  selectedPeriod: { key: string; value: string; }[];
periodList = [
  {key: 'ThisWeek', value: 'This Week'},
  {key: 'ThisMonth', value: 'This Month'},
  {key: 'ThisQuarter', value: 'This Quarter'},
  {key: 'ThisYear', value: 'This Year'}
];
  private readonly salesManager = 'salesManager';

  constructor(private leaderboardService: LeaderboardService, private route: ActivatedRoute) { }

  ngOnInit() {
    //  this.route.data.subscribe(data => {this.pipeline = data['pipelineResolver']; });
    this.leaderboardService.getStaffMemberPipeline(this.salesManager)
      .subscribe(result => {
      this.leaderboardResult = result;
        this.pipelineList = result.result;
        console.log(result.result, this.pipelineList);
      });

    this.leaderboardService.getStaffMemberExchanges(this.salesManager, this.period).subscribe(data => {
      this.leaderboardResult = data;
      this.exchanges = data.result;
      console.log(this.exchanges);
    });
  }
  onOptionsSelected(val: any) {
    this.getSelectedPeriod(val);
    const selectedPeriodArray = this.selectedPeriod[Object.keys(this.selectedPeriod)[0]];
    const key = Object.values(selectedPeriodArray)[0];
    // this.period = JSON.stringify(key);
    
    console.log( this.period , key);
  }
  getSelectedPeriod(val: any) {
    this.selectedPeriod = this.periodList.filter(function(data) {
      return data.value === val;
    });
  }
}
