import { Component, OnInit, Input } from '@angular/core';
import { Company } from 'src/app/contact-groups/shared/contact-group';

@Component({
  selector: 'app-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss']
})
export class CompanyInfoComponent implements OnInit {
  @Input()  companyDetails: Company;
  constructor() { }

  ngOnInit() {
  }

}
