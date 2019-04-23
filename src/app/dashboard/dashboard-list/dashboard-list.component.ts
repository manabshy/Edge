import { Component, OnInit } from '@angular/core';

import { Pipeline, Instruction, Applicant, InstructionResult } from '../shared/dashboard';
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
  private instruction;
  period: string;
  pipeline: Pipeline[];
  instructions: Instruction[];
  instructedAddresses: any[];
  applicants: Applicant[];
  staffMemberId: number;

  set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.period = this.getSelectedPeriod(this._selectedPeriod);
    this.getDashboardInstructions(this.staffMemberId, this.role, this.selectedPeriod, 100);
    console.log('selected period is: ', this.period);
  }
  get selectedPeriod() {
    return this._selectedPeriod;
  }
  set selectedInstruction(address: string) {
   this.instruction = this.instructions.find(x => x.propertyAddress === address);
  }
  get selectedInstruction() {
    return this.instruction;
  }

  constructor( private dashboardService: DashboardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectedPeriod = 'ThisQuarter';
    // this.route.params.subscribe(params => {
    // const staffMemberId = +params.get('id');
    //  this.getDashboardInstructions(staffMemberId, this.role);
    //   console.log(+params.get('id')); });
    this.route.params.subscribe(() => {
       this.staffMemberId = +this.route.snapshot.paramMap.get('id') || 0;
       this.getDashboardInstructions(this.staffMemberId, this.role, this.selectedPeriod, 100);
       console.log('this should not be undefined', this.staffMemberId);
      });
  }
  getDashboardInstructions(id: number, role: string, period?: string, pageSize?: number): void {
    this.dashboardService.getDashboardInstructions(id, role, period, pageSize)
      .subscribe(result => {
        this.instructions = result;
       this.getInstructedAddresses();
       console.log(this.instructions);
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
  getInstructedAddresses() {
   if (this.instructions !== null) {
    this.instructedAddresses = Array.from(this.instructions, p => p.propertyAddress);
   }
  }

}
