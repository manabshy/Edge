import { Component, OnInit, Input } from '@angular/core';
import { Offer } from '../shared/dashboard';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.css']
})
export class DashboardListComponent implements OnInit {
  @Input() offers: Offer[];

  constructor() { }

  ngOnInit() {
  }

}
