import { Component, OnInit, Input } from '@angular/core';
import { Dashboard } from '../shared/dashboard';
@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
@Input() myDashboard: Dashboard[];
  constructor() { }

  ngOnInit() {
  }


}
