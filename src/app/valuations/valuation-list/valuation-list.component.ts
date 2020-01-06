import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { Valuation, ValuationStatusEnum } from '../shared/valuation';
import { ValuationService } from '../shared/valuation.service';

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

  constructor(private valuationService: ValuationService) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.valuations) {
      console.log('valuations', this.valuations)
      this.valuations.forEach(x => {
        x.valuationStatusLabel = ValuationStatusEnum[x.valuationStatus];
      });
    }
    this.page = this.pageNumber;
  }

  onScrollDown() {
    this.onWindowScroll();
    console.log('scrolled')
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let scrollHeight: number, totalHeight: number;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;

    if (totalHeight >= scrollHeight && !this.bottomReached) {
      this.page++;
      this.valuationService.valuationPageNumberChanged(this.page);
      console.log('valuations page number', this.page)
    }
  }
}
