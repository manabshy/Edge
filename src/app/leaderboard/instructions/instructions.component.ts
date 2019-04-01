import { Component, OnInit, Input } from '@angular/core';

import { Leaderboard } from '../shared/leaderboard';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.css']
})
export class InstructionsComponent implements OnInit {
  @Input() instructions: Leaderboard[];
  @Input() originalInstructions: Leaderboard[];
  @Input() selectedPeriodLabel: string;
  @Input() noInstructions: boolean;


  constructor() { }

  ngOnInit() {
  }
  onScrollDown() {
    if (this.instructions.length < this.originalInstructions.length) {
      const len = this.instructions.length;

      for (let i = len; i <= len; i++) {
        this.instructions.push(this.originalInstructions[i]);
      }
    }
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

}
