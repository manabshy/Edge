import { Component, OnInit, Input } from '@angular/core';
import { CompanyAutoCompleteResult } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-company-list',
  templateUrl: './company-list.component.html',
  styleUrls: ['./company-list.component.scss']
})
export class CompanyListComponent implements OnInit {

@Input()  companies: CompanyAutoCompleteResult[];
@Input() companyName: string;
  constructor() { }

  ngOnInit() {
  }

}
