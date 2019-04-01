import { Component, OnInit } from '@angular/core';

import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard, LeaderboardResult } from './shared/leaderboard';
import { ActivatedRoute } from '@angular/router';
import { Constants } from '../core/shared/period-list';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  originalInstructions: Leaderboard[] = [];
  instructions: Leaderboard[] = [];
  pipelineList: Leaderboard[] = [];
  exchanges: Leaderboard[] = [];
  leaderboardResult: LeaderboardResult;
  resultCount: number;
  private _selectedPeriod: string;
  selectedPeriodLabel: string;
  periodList = Constants.PeriodList;
  private readonly salesManager = 'salesManager';
  filterVisibility = 'visible';
  noInstructions = true;

 set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.selectedPeriodLabel = this.periodList.find(o => o.key === val).value;
    this.getExchanges( this.salesManager, this.selectedPeriod);
    this.getInstructions(this.salesManager, this.selectedPeriod, 100);
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
  getInstructions(role: string, period: string, pageSize: any) {
    this.leaderboardService.getStaffMemberInstructions(role, period, pageSize).subscribe(data => {
      this.leaderboardResult = data;
      this.originalInstructions = data.result;
      this.instructions = data.result.slice(0, 10);
      // const len = data.result.length;
      // if (len > 0) {
      //   this.instructions = data.result.slice(0, 10);
      //   this.noInstructions = false;
      // } else {
      //   this.instructions = [];
      // }
      console.log(this.instructions);
    });
  }

  showFilter(val: string) {
    this.filterVisibility = val;
  }
}
