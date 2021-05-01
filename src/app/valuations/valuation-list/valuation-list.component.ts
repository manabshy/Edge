import { Component, OnInit, Input, OnChanges, HostListener, OnDestroy } from '@angular/core';
import { Valuation, ValuationStatusEnum } from '../shared/valuation';
import { ValuationService } from '../shared/valuation.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-valuation-list',
  templateUrl: './valuation-list.component.html',
  styleUrls: ['./valuation-list.component.scss']
})
export class ValuationListComponent implements OnInit, OnChanges, OnDestroy {

  @Input() valuations: Valuation[];
  @Input() searchTerm: string;
  @Input() bottomReached: boolean;
  @Input() pageNumber: number;
  page: number;

  constructor(private valuationService: ValuationService, private router: Router, private activatedRoute: ActivatedRoute) { }

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

  navigateTo(path: any[]) {
    this.router.navigate(path, { relativeTo: this.activatedRoute });
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
    const url = this.router.url;
    const isValuationsRegister = url.endsWith('/valuations-register');

    if (isValuationsRegister) {
      if (totalHeight >= scrollHeight && !this.bottomReached) {
        console.log('%c first request NOOOOO', 'color:green', this.page)
       if(this.valuations && this.valuations.length) {
         this.page++;
         console.log('%c Not first request', 'color:purple', this.page)
         this.valuationService.valuationPageNumberChanged(this.page);
          console.log('valuations page number', this.page)
       }
      }
    }
  }

  ngOnDestroy() {
    this.valuationService.valuationPageNumberChanged(0);
    console.log('%c on destroy ', 'color:blue', this.page)
  }
}
