import { Component, OnInit } from '@angular/core';
import { DashboardService } from './shared/dashboard.service';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';
import { Dashboard, DashboardResult, TeamDashboardResult } from './shared/dashboard';
import { User } from '../core/models/user';
import { AppConstants } from '../core/shared/app-constants';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myDashboard: Dashboard;
  teamDashboard: Dashboard[];
  dashboardResult: DashboardResult;
  teamDashboardResult: TeamDashboardResult;
  user: User;
  period: string;
  private username: string;
  staffMemberId: number;
  private _selectedPeriod: string;
  // selectedPeriodArray: { key: string; value: string; }[];
  periodList = [
    {key: 'ThisWeek', value: 'This Week'},
    {key: 'ThisMonth', value: 'This Month'},
    {key: 'ThisQuarter', value: 'This Quarter'},
    {key: 'ThisYear', value: 'This Year'}
  ];
    private readonly salesManager = 'salesManager';
  set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.period = this.getSelectedPeriod(this._selectedPeriod);
    this.getStaffMemberDashboard(2337, this.salesManager, this.selectedPeriod);
    this.getTeamMembersDashboard(2337, this.salesManager, this.selectedPeriod);
  }
  get selectedPeriod() {
    return this._selectedPeriod;
  }
  constructor( private dashboardService: DashboardService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    this.selectedPeriod = 'ThisQuarter';
  }
  getUserByUsername(username: string): void {
    this.userService.getUserByEmail(username)
    .subscribe(user => {this.user = user; this.username = user.exchangeUsername; },
      err => console.log(err)
    );
  }

  getStaffMemberDashboard(id: number, role: string, period?: string): void {
    this.dashboardService.getStaffMemberDashboard(id, role, period)
      .subscribe(data => {
        this.dashboardResult = data;
        this.myDashboard = data.result;
        console.log(this.dashboardResult);
      });
  }
  getTeamMembersDashboard(id: number, role: string, period?: string): void {
    this.dashboardService.getTeamMembersDashboard(id, role, period)
      .subscribe(data => {
        this.teamDashboardResult = data;
        this.teamDashboard = data.result;
        console.log(this.teamDashboardResult);
      });
  }
  getSelectedPeriod(val: string) {
    const periodArray = this.periodList.filter(x => x.key === val);
    const periodValue = Object.values(periodArray)[0].value;
    return periodValue;
  }
}
