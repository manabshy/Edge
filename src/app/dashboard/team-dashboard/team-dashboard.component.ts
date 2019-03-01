import { Component, OnInit, Input } from '@angular/core';
import { Dashboard } from '../shared/dashboard';

@Component({
  selector: 'app-team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.css']
})
export class TeamDashboardComponent implements OnInit {
  @Input() teamDashboard: Dashboard[];
  
  constructor() { }

  ngOnInit() {
  }

}
