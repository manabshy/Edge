import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Dashboard } from '../shared/dashboard';
import { DashboardService } from '../shared/dashboard.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/core/services/auth.service';
import { User } from 'src/app/core/models/user';
import { UserService } from 'src/app/core/services/user.service';
@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
 dashboard: Dashboard;
 user: User;
 private username: string;
  myDashboardForm: FormGroup;
  userForm: FormGroup;
  constructor(
     private fb: FormBuilder,
     private dashboardService: DashboardService,
     private router: Router,
     private authService: AuthService,
     private userService: UserService
     ) {}

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
    this.userForm = this.fb.group({
      firstName: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      username: ['', Validators.required],
      exchangeUsername: ['', Validators.required],
      staffMemberId: 0
    });
   this.username = this.authService.getUsername();
  //  this.userService.getUserByUsername(this.username).subscribe((user: User) => this.user = user);

  //  const dashboard = this.getStaffMemberDashboard(2337, 'salesManager');
    this.getUserByUsername(this.username);
    console.log(this.user);
  }

  getUserByUsername(username: string): void {
    this.userService.getUserByUsername(username)
    .subscribe(user => {this.displayUser(user); this.user = user; },
      err => console.log(err)
    );
  }
  displayUser(user: User): void {
    if (this.userForm) {
      this.userForm.reset();
    }
    this.user = user;
    // console.log(user);
     this.userForm.patchValue({
      firstName: this.user.firstName,
      surname: this.user.surname,
      username: this.user.username,
      exchangeUsername: this.user.exchangeUsername,
      staffMemberId : this.user.staffMemberId
    });
  }
  getStaffMemberDashboard(id: number, role: string): void {
    this.dashboardService.getStaffMemberDashboard(id, role)
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
