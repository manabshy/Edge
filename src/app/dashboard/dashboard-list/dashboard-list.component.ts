import { Component, OnInit } from '@angular/core';

import { Instruction, Applicant, Valuation } from '../shared/dashboard';
import { Constants } from 'src/app/core/shared/period-list';
import { DashboardService } from '../shared/dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.scss']
})
export class DashboardListComponent implements OnInit {
  private _selectedPeriod: string;
  periodList = Constants.PeriodList;
  private _searchTerm: string;
  private readonly role = 'salesManager';
  period: string;
  instructions: Instruction[];
  valuations: Valuation[];
  applicants: Applicant[];
  allInstructions: Instruction[];
  staffMemberId =  0;
  periodKey: string;
  isValuation: boolean;
  isAllInstructions: boolean;
  isInstructions: boolean;
  isExchanges: boolean;
  isPipeline: boolean;
  isBdd: boolean;

  set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.period = this.getSelectedPeriod(this._selectedPeriod);
    this.periodKey = this.getSelectedPeriodKey(this._selectedPeriod);
    this.getDashboardInstructions(this.staffMemberId, this.role, this.selectedPeriod, 100);
    this.getDashboardValuations(this.staffMemberId, this.role, this.selectedPeriod, 100);
  }
  get selectedPeriod() {
    return this._selectedPeriod;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
  }
  get searchTerm(): string {
    return this._searchTerm;
  }
  constructor( private dashboardService: DashboardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params =>  {
      this.selectedPeriod = params['periodFilter'] || 'ThisQuarter';
      this.isValuation = params['isValuation'];
      this.isAllInstructions = params['isAllInstructions'];
      this.isInstructions = params['isInstructions'];
      this.isBdd = params['isBdd'];
      this.isExchanges = params['isExchanges'];
      this.isPipeline = params['isPipeline'];
     } );

    this.route.params.subscribe(() => {
      this.staffMemberId = +this.route.snapshot.paramMap.get('id') || 0;
    });
    this.getDashboardInstructions(this.staffMemberId, this.role, this.selectedPeriod, 100);
    this.getDashboardAllInstructions(this.staffMemberId, this.role, 'All', 100);
    this.getDashboardValuations(this.staffMemberId, this.role, this.selectedPeriod, 100);
  }
  getDashboardInstructions(id: number, role: string, period?: string, pageSize?: number): void {
    this.dashboardService.getDashboardInstructions(id, role, period, pageSize)
      .subscribe(result => {
        this.instructions = result;
      });
  }
  getDashboardAllInstructions(id: number, role: string, period?: string, pageSize?: number): void {
    this.dashboardService.getDashboardInstructions(id, role, period, pageSize)
      .subscribe(result => {
        this.allInstructions = result;
        console.log('all instructions', this.allInstructions);
      });
  }
  getDashboardValuations(id: number, role: string, period?: string, pageSize?: number): void {
    this.dashboardService.getDashboardValuations(id, role, period, pageSize)
      .subscribe(result => {
        this.valuations = result;
      });
  }
  getDashboardApplicants(id: number, role: string): void {
    this.dashboardService.getDashboardApplicants(id, role)
      .subscribe(data => {
        this.applicants = data.result;
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
}
