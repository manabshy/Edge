import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard, LeaderboardResult } from './shared/leaderboard';
import { ActivatedRoute } from '@angular/router';
import { pipe } from '@angular/core/src/render3';

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
period = 'ThisYear';
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

}
