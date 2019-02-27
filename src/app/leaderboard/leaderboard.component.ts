import { Component, OnInit } from '@angular/core';
import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard } from './shared/leaderboard';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.css']
})
export class LeaderboardComponent implements OnInit {
instructions: Leaderboard[] = [];
pipeline: Leaderboard[] = [];
exchanges: Leaderboard[] = [];

  constructor(private leaderboardService: LeaderboardService) { }

  ngOnInit() {
  }

}
