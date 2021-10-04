import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { CompanyAutoCompleteResult } from 'src/app/contact-groups/shared/contact-group';
import { CompanyService } from '../shared/company.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnChanges {

  @Input() companies: CompanyAutoCompleteResult[];
  @Input() companyName: string;
  @Input() searchTerm: string;
  @Input() bottomReached: boolean;
  @Input() pageNumber: number;
  page: number;
  constructor(private companyService: CompanyService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
  }

  ngOnChanges() {
    this.page = this.pageNumber;
  }

  onScrollDown() {
    this.onWindowScroll();
    console.log('scrolled');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    let scrollHeight: number, totalHeight: number;
    scrollHeight = document.body.scrollHeight;
    totalHeight = window.scrollY + window.innerHeight;
    const url = this.router.url;
    const isCompanyCentre = url.endsWith('/company-centre');
    if (isCompanyCentre) {
      if (totalHeight >= scrollHeight && !this.bottomReached) {
        this.page++;
        this.companyService.companyPageChanged(this.page);
        console.log('companies page number', this.page);
      }
    }
  }

  navigateToDetails(companyId: number) {
    this.router.navigate(['detail', companyId], { relativeTo: this.route })
  }
}
