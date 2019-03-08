import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';

import { DashboardService } from './shared/dashboard.service';
import { Dashboard, DashboardResult, TeamDashboardResult, DashboardTotals } from './shared/dashboard';
import { User, UserResult } from '../core/models/user';

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
  dashboardTotals: DashboardTotals;
  totalApplicants: number;
  totalOffersAgreed: number;
  totalOffersReceived: number;
  totalViewings: number;
  totalExchanges: number;
  totalPipeline: number;


  period: string;
  email: string;
  firstName: string;
  @Input() userResult: UserResult;
  user: User;
  @Input() staffMemberId: number;
  private _selectedPeriod: string;
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
  constructor( private dashboardService: DashboardService) { }

  ngOnInit() {
    this.selectedPeriod = 'ThisQuarter';
  }

  // ngOnChanges(changes: SimpleChanges) {
  //   if (this.staffMemberId) {
  //     this.getStaffMemberDashboard(this.staffMemberId, this.salesManager, this.selectedPeriod);
  //     console.log('from me dashboard ' + this.staffMemberId);
  //   }
  // }
  getStaffMemberDashboard(id: number, role: string, period?: string): void {
    this.dashboardService.getStaffMemberDashboard(id, role, period)
      .subscribe(data => {
        this.dashboardResult = data;
        this.myDashboard = data.result;
      });
  }
  getTeamMembersDashboard(id: number, role: string, period?: string): void {
    this.dashboardService.getTeamMembersDashboard(id, role, period)
      .subscribe(data => {
        this.teamDashboardResult = data;
        this.teamDashboard = data.result;
        this.getDashboardTotals(data.result);
      });
  }
  getSelectedPeriod(val: string) {
    const periodArray = this.periodList.filter(x => x.key === val);
    const periodValue = Object.values(periodArray)[0].value;
    return periodValue;
  }
  getDashboardTotals(dashboard: Dashboard[]) {
    const initialValue = 0;

    const applicants = dashboard.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.applicants.totalCount, initialValue);
    this.totalApplicants = isNaN(applicants) ? 0 : applicants;

    const viewings = dashboard.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.viewings.periodCount, initialValue);
    this.totalViewings = isNaN(viewings) ? 0 : viewings;

    const offersAgreed = dashboard.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.offersAgreed.periodCount, initialValue);
    this.totalOffersAgreed = isNaN(offersAgreed) ? 0 : offersAgreed;

    const offersReceived = dashboard.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.offersReceived.periodCount, initialValue);
    this.totalOffersReceived = isNaN(offersReceived) ? 0 : offersReceived;

    const exchanges = dashboard.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.exchanges.periodFees, initialValue);
    this.totalExchanges = isNaN(exchanges) ? 0 : exchanges;

    const pipeline = dashboard.reduce(
      (accumulator, currentValue) =>
        accumulator + currentValue.pipeline.totalFees, initialValue);
    this.totalPipeline = isNaN(pipeline) ? 0 : pipeline;
  }
}
