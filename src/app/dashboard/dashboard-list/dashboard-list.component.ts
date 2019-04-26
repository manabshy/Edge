import { Component, OnInit } from '@angular/core';

import { Pipeline, Instruction, Applicant, Valuation } from '../shared/dashboard';
import { Constants } from 'src/app/core/shared/period-list';
import { DashboardService } from '../shared/dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.css']
})
export class DashboardListComponent implements OnInit {
  private _selectedPeriod: string;
  periodList = Constants.PeriodList;
  private readonly role = 'salesManager';
  period: string;
  instructions: Instruction[];
  valuations: Valuation[];
  applicants: Applicant[];
  staffMemberId =  0;
  periodKey: string;
  isValuation: boolean;

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
  // set selectedInstruction(address: string) {
  //  this.instruction = this.instructions.find(x => x.propertyAddress === address);
  // }
  // get selectedInstruction() {
  //   return this.instruction;
  // }

  constructor( private dashboardService: DashboardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.staffMemberId = 0;
    console.log('before getting id from route', this.staffMemberId);
    this.route.queryParams.subscribe(params =>  {
      this.selectedPeriod = params['periodFilter'] || 'ThisQuarter';
      this.isValuation = params['isValuation'];  } );

    this.route.params.subscribe(() => {
       this.staffMemberId = +this.route.snapshot.paramMap.get('id') || 0;
       this.getDashboardInstructions(this.staffMemberId, this.role, this.selectedPeriod, 100);
       this.getDashboardValuations(this.staffMemberId, this.role, this.selectedPeriod, 100);
       console.log('after getting id from route', this.staffMemberId);
      });
  }
  getDashboardInstructions(id: number, role: string, period?: string, pageSize?: number): void {
    this.dashboardService.getDashboardInstructions(id, role, period, pageSize)
      .subscribe(result => {
        this.instructions = result;
       console.log(this.instructions);
      });
  }
  getDashboardValuations(id: number, role: string, period?: string, pageSize?: number): void {
    this.dashboardService.getDashboardValuations(id, role, period, pageSize)
      .subscribe(result => {
        this.valuations = result;
       console.log(this.valuations);
      });
  }
  getDashboardApplicants(id: number, role: string): void {
    this.dashboardService.getDashboardApplicants(id, role)
      .subscribe(data => {
        this.applicants = data.result;
        console.log(this.applicants);
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
