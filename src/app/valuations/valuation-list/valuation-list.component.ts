import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Valuation, ValuationStatus } from '../shared/valuation';

@Component({
  selector: 'app-valuation-list',
  templateUrl: './valuation-list.component.html',
  styleUrls: ['./valuation-list.component.scss']
})
export class ValuationListComponent implements OnInit, OnChanges {

  @Input() valuations: Valuation[];
  @Input() searchTerm: string;
  @Input() bottomReached: boolean;
  @Input() pageNumber: number;
  page: number;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.valuations) {
      console.log('valuations', this.valuations)
      this.valuations.forEach(x => {
        x.valuationStatusLabel = ValuationStatus[x.valuationStatus];
      });
    }
  }
}
