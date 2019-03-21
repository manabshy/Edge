import { Component, OnInit, Input } from '@angular/core';
import { Leaderboard } from '../shared/leaderboard';

import { OrderPipe } from 'ngx-order-pipe';

@Component({
  selector: 'app-pipeline',
  templateUrl: './pipeline.component.html',
  styleUrls: ['./pipeline.component.css']
})
export class PipelineComponent implements OnInit {
@Input() pipelineList: Leaderboard[] = [];
sortedPipelineList: any[];
order: string = 'totalFees';
reverse: boolean = true;
  constructor(private orderPipe: OrderPipe) {
    this.sortedPipelineList = orderPipe.transform(this.pipelineList, 'totalFees');
  }

  ngOnInit() {
  }

  setOrder(value: string) {
    if (this.order === value) {
      this.reverse = !this.reverse;
    } else {
      this.reverse = true;
    }

    this.order = value;
  }
  

}
