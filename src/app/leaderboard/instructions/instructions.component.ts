import { Component, OnInit, Input } from '@angular/core';

import { Leaderboard } from '../shared/leaderboard';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-instructions',
  templateUrl: './instructions.component.html',
  styleUrls: ['./instructions.component.scss']
})
export class InstructionsComponent implements OnInit {
  @Input() instructions: Leaderboard[];
  @Input() originalInstructions: Leaderboard[];
  @Input() selectedPeriodLabel: string;


  constructor() { }

  ngOnInit() {
  }
  onScrollDown() {
    AppUtils.setupInfintiteScroll(this.originalInstructions, this.instructions);
    console.log('scrolled down!!');
  }

  onScrollUp() {
    console.log('scrolled up!!');
  }

}
