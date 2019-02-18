import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Dashboard } from "../shared/dashboard";
import { DashboardService } from "../shared/dashboard.service";
import { Router, ActivatedRoute } from "@angular/router";
@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
 dashboard: Dashboard;
  myDashboardForm: FormGroup;
  constructor(private fb: FormBuilder,
     private dashboardService: DashboardService, private route: Router) {}

  ngOnInit() {
    this.myDashboardForm = this.fb.group({
      period: [''],
      periodStartDate: new Date(),
      periodEndDate: 0,
      valuations: 0,
      instructions: 0,
      applicants: 0,
      viewings: 0,
      offersAgreed: 0,
      offersReceived: 0,
      businessDevelopment: 0,
      exchanges: 0,
      pipeline: 0,
      liveTenancies: 0
    });
    // this.route.paramMap.subscribe(params => { this.id = +params.get('id'); });
  }
  getStaffMemberDashboard(id: number): void {
    this.dashboardService.getStaffMemberDashboard(id)
      .subscribe(data => {
        this.displayDashboardFigures(data);
      });
  }
  displayDashboardFigures(dashboard: Dashboard): void {
    if (this.myDashboardForm) {
      this.myDashboardForm.reset();
    }
    this.dashboard = dashboard;
    console.log(dashboard);
    this.myDashboardForm.patchValue({
      period: this.dashboard.period,
      periodStartDate: this.dashboard.periodStartDate,
      periodEndDate: this.dashboard.periodEndDate,
      valuations: this.dashboard.valuations,
      instructions: this.dashboard.instructions,
      applicants: this.dashboard.applicants,
      viewings: this.dashboard.viewings,
      offersAgreed: this.dashboard.offersAgreed,
      offersReceived: this.dashboard.offersReceived,
      businessDevelopment: this.dashboard.businessDevelopment,
      exchanges: this.dashboard.exchanges,
      pipeline: this.dashboard.pipeline,
      liveTenancies: this.dashboard.liveTenancies
    });
  }
}
