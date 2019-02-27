import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard } from './shared/leaderboard';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
instructions: Leaderboard[] = [];
pipeline: Leaderboard[] = [];
exchanges: Leaderboard[] = [];

  constructor(private leaderboardService: LeaderboardService, private route: ActivatedRoute) { }

  ngOnInit() {
     this.route.data.subscribe(data => {this.pipeline = data['pipelineResolver']; });
  }

}
