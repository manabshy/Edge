import { Component, OnInit, Input } from '@angular/core';
import { Offer, Pipeline, Instruction, Applicant } from '../shared/dashboard';
import { Constants } from 'src/app/core/shared/period-list';
import { DashboardService } from '../shared/dashboard.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard-list',
  templateUrl: './dashboard-list.component.html',
  styleUrls: ['./dashboard-list.component.css']
})
export class DashboardListComponent implements OnInit {
  // @Input() pipeline: Pipeline[];
  // @Input()  instructions: Instruction[];
  // @Input() offers: Offer[];

  // constructor() { }

  // ngOnInit() {
  // }
  private _selectedPeriod: string;
  periodList = Constants.PeriodList;
  private readonly role = 'salesManager';
  // staffMemberId: number;
  period: string;
  pipeline: Pipeline[];
  instructions: Instruction[];
  applicants: Applicant[];
  set selectedPeriod(val: string) {
    this._selectedPeriod = val;
    this.period = this.getSelectedPeriod(this._selectedPeriod);
    // this.getDashboardInstructions(this.staffMemberId, this.role, this.selectedPeriod);
  }
  get selectedPeriod() {
    return this._selectedPeriod;
  }
  constructor( private dashboardService: DashboardService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.selectedPeriod = 'ThisQuarter';
    // this.route.params.subscribe(params => {
    // const staffMemberId = +params.get('id');
    //  this.getDashboardInstructions(staffMemberId, this.role);
    //   console.log(+params.get('id')); });
    this.route.params.subscribe(params => {
      const staffMemberId = +this.route.snapshot.paramMap.get('id');
       this.getDashboardInstructions(staffMemberId, this.role, this.selectedPeriod);
      });
  }
  getDashboardInstructions(id: number, role: string, period?: string): void {
    this.dashboardService.getDashboardInstructions(id, role, period)
      .subscribe(data => {
        this.instructions = data.result;
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
}
