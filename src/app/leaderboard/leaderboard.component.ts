import { Component, OnInit } from '@angular/core';

import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard, LeaderboardResult } from './shared/leaderboard';
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
private _selectedPeriod: string;
selectedPeriodArray: { key: string; value: string; }[];
periodList = [
  {key: 'ThisWeek', value: 'This Week'},
  {key: 'ThisMonth', value: 'This Month'},
  {key: 'ThisQuarter', value: 'This Quarter'},
  {key: 'ThisYear', value: 'This Year'}
];
  private readonly salesManager = 'salesManager';
 set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.getExchanges( this.salesManager, this.selectedPeriod);
    this.getInstructions(this.salesManager, this.selectedPeriod);
  }
 get selectedPeriod() {
    return this._selectedPeriod;
  }
  constructor(private leaderboardService: LeaderboardService, private route: ActivatedRoute) { }

  ngOnInit() {
    //  this.route.data.subscribe(data => {this.pipeline = data['pipelineResolver']; });
    this.route.queryParams
      .subscribe(params => this.selectedPeriod = params['period'] || 'ThisQuarter');
    this.leaderboardService.getStaffMemberPipeline(this.salesManager)
      .subscribe(result => {
        this.leaderboardResult = result;
        this.pipelineList = result.result;
      });
  }

  getExchanges(role: string, period: string) {
    this.leaderboardService.getStaffMemberExchanges(role, period).subscribe(data => {
      this.leaderboardResult = data;
      this.exchanges = data.result;
    });
  }
  getInstructions(role: string, period: string) {
    this.leaderboardService.getStaffMemberInstructions(role, period).subscribe(data => {
      this.leaderboardResult = data;
      this.instructions = data.result;
    });
  }
  onOptionsSelected(val: any) {
    this.selectedPeriod = val;
  }
  getSelectedPeriod(val: any) {
    this.selectedPeriodArray = this.periodList.filter(function(data) {
      return data.value === val;
    });
  }
}
