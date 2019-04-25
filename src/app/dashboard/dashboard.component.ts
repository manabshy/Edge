import { Component, OnInit, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';

import { DashboardService } from './shared/dashboard.service';
import { Dashboard, DashboardResult, TeamDashboardResult, DashboardTotals, OffersResult, Pipeline, Instruction } from './shared/dashboard';
import { User, UserResult } from '../core/models/user';
import { Constants } from '../core/shared/period-list';
import { TabsetComponent, TabDirective } from 'ngx-bootstrap/tabs/';
import { AppUtils } from '../core/shared/utils';
import { StaffMember } from '../core/models/staff-member';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  myDashboard: Dashboard;
  teamDashboard: Dashboard[];
  dashboardResult: DashboardResult;
  teamDashboardResult: TeamDashboardResult;
  pipeline: Pipeline[];
  instructions: Instruction[];
  dashboardTotals: DashboardTotals;
  totalApplicants: number;
  totalOffersAgreed: number;
  totalOffersReceived: number;
  totalViewings: number;
  totalExchanges: number;
  totalPipeline: number;
  offerResult: OffersResult;

  period: string;
  periodKey: string;
  email: string;
  firstName: string;
  @Input() currentStaffMember: StaffMember;
  user: User;
  private _selectedPeriod: string;
  periodList = Constants.PeriodList;
  private readonly role = 'salesManager';

  @ViewChild('dashboardTabs') dashboardTabs: TabsetComponent;
  selectedTab: number;

  set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.period = this.getSelectedPeriod(this._selectedPeriod);
    this.periodKey = this.getSelectedPeriodKey(this._selectedPeriod);
    // this.getStaffMemberDashboard(this.staffMember.staffMemberId, this.role, this.selectedPeriod);
    this.getStaffMemberDashboard(2337, this.role, this.selectedPeriod);
    this.getTeamMembersDashboard(2337, this.role, this.selectedPeriod);
    this.getDashboardPipeline(2337, this.role, this.selectedPeriod);
    this.getDashboardInstructions(2337, this.role, this.selectedPeriod);
  }
  get selectedPeriod() {
    return this._selectedPeriod;
  }
  constructor( private dashboardService: DashboardService, protected route: ActivatedRoute) { }

  ngOnInit() {
      this.route.queryParams.subscribe(params =>  {
      this.selectedPeriod = params['periodFilter'] || 'ThisQuarter';}
      );
    console.log('delayed staffMember', this.currentStaffMember);
    if (AppUtils.dashboardSelectedTab) {
      this.dashboardTabs.tabs[AppUtils.dashboardSelectedTab].active = true;
    }
  }

  onSelect(data: TabDirective): void {
    setTimeout(() => {
      this.selectedTab = data.tabset.tabs.findIndex(item => item.active);
      AppUtils.dashboardSelectedTab = this.selectedTab;
    });
  }

  getStaffMemberDashboard(id: number, role: string, period?: string): void {
    this.dashboardService.getStaffMemberDashboard(id, role, period)
      .subscribe(result => {
        this.myDashboard = result;
      });
  }
  getTeamMembersDashboard(id: number, role: string, period?: string): void {
    this.dashboardService.getTeamMembersDashboard(id, role, period)
      .subscribe(result => {
        this.teamDashboard = result;
        this.getDashboardTotals(result);
      });
  }
  getDashboardPipeline(id: number, role: string, period?: string): void {
    this.dashboardService.getDashboardPipeline(id, role, period)
      .subscribe(result => {
        this.pipeline = result;
      });
  }
  getDashboardInstructions(id: number, role: string, period?: string): void {
    this.dashboardService.getDashboardInstructions(id, role, period)
      .subscribe(result => {
        this.instructions = result;
      });
  }

  getSelectedPeriod(val: string) {
    const periodArray = this.periodList.filter(x => x.key === val);
    const periodValue = Object.values(periodArray)[0].value;
    return periodValue;
  }
  getSelectedPeriodKey(val: string) {
    const periodArray = this.periodList.filter(x => x.key === val);
    const periodKey = Object.values(periodArray)[0].key;
    return periodKey;
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

  // private getTotals(dashboard: any) {
  //   const initialValue = 0;
  //    const result = dashboard.reduce(
  //      (accumulator, currentValue) =>
  //       accumulator + currentValue, initialValue);
  //       return result;
  // }
}
