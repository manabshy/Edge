import { Component, OnInit, Input, OnChanges, HostListener } from '@angular/core';
import { CompanyAutoCompleteResult } from 'src/app/contactgroups/shared/contact-group';
import { CompanyService } from '../shared/company.service';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit, OnChanges {

@Input()  companies: CompanyAutoCompleteResult[];
@Input() companyName: string;
@Input() searchTerm: string;
@Input() bottomReached: boolean;
@Input() pageNumber: number;
page: number;
  constructor(  private companyService: CompanyService ) { }

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
    if (window.innerHeight + window.scrollY === document.body.scrollHeight && !this.bottomReached) {
      this.page++;
      this.companyService.companyPageChanged(this.page);
      console.log('companies page number', this.page);
    }
  }
}
