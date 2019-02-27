import { Component, OnInit, Input } from '@angular/core';
import { Leaderboard } from '../shared/leaderboard';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {
@Input() pipeline: Leaderboard;
  constructor() { }

  ngOnInit() {
  }

}
