import { Component, OnInit, Input } from '@angular/core';
import { Dashboard, DashboardTotals } from '../shared/dashboard';

@Component({
  selector: 'app-team-dashboard',
  templateUrl: './team-dashboard.component.html',
  styleUrls: ['./team-dashboard.component.scss']
})
export class TeamDashboardComponent implements OnInit {
  @Input() teamDashboard: Dashboard[];
  @Input() dashboardTotals: DashboardTotals;
  @Input() totalApplicants: number;
  @Input() totalExchanges: number;
  @Input() totalViewings: number;
  @Input() totalOffersAgreed: number;
  @Input() totalOffersReceived: number;
  @Input() totalPipeline: number;

  constructor() { }

  ngOnInit() {
  }

}
