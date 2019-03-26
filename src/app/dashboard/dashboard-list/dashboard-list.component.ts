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
  set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.period = this.getSelectedPeriod(this._selectedPeriod);
  }
  get selectedPeriod() {
    return this._selectedPeriod;
  }
  set selectedInstruction(address: string) {
   this.instruction = this.instructions.find(x => x.propertyAddress === address);
    console.log(this.instruction);
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
      const staffMemberId = +this.route.snapshot.paramMap.get('id');
       this.getDashboardInstructions(staffMemberId, this.role, this.selectedPeriod);
      });
  }
  getDashboardInstructions(id: number, role: string, period?: string): void {
    this.dashboardService.getDashboardInstructions(id, role, period)
      .subscribe(data => {
        this.instructions = data.result;
       this.getInstructedAddresses();
        console.log(this.instructedAddresses);
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
    this.instructedAddresses = Array.from(this.instructions, p => p.propertyAddress);
  }

}
