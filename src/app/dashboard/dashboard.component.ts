import { Component, OnInit } from '@angular/core';
import { DashboardService } from './shared/dashboard.service';
import { UserService } from '../core/services/user.service';
import { AuthService } from '../core/services/auth.service';
import { Dashboard, DashboardResult } from './shared/dashboard';
import { User } from '../core/models/user';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  myDashboard: Dashboard[];
  teamDashboard: Dashboard[];
  dashboardResult: DashboardResult;
  user: User;
  private username: string;

  constructor( private dashboardService: DashboardService,
    private userService: UserService,
    private authService: AuthService) { }

  ngOnInit() {
    console.log(this.authService.getUsername());
    //  this.userService.getUserByUsername(this.username).subscribe((user: User) => this.user = user);

    //  const dashboard = this.getStaffMemberDashboard(2337, 'salesManager');
     // this.getUserByUsername(this.username);
  }
  getUserByUsername(username: string): void {
    this.userService.getUserByUsername(username)
    .subscribe(user => {this.user = user; },
      err => console.log(err)
    );
  }

  getStaffMemberDashboard(id: number, role: string): void {
    this.dashboardService.getStaffMemberDashboard(id, role)
      .subscribe(data => {
        this.dashboardResult = data;
        this.myDashboard = data.result;
      });
  }
}
