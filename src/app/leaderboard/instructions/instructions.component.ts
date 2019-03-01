import { Component, OnInit, Input } from '@angular/core';

import { Leaderboard } from '../shared/leaderboard';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {
  @Input() instructions: Leaderboard[];

  constructor() { }

  ngOnInit() {
  }

}
