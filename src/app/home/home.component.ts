import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../core/services/auth.service';
import { UserResult, User } from '../core/models/user';
import { UserService } from '../core/services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  email: string;
  firstName: string;
  staffMemberId: number;
  userResult: UserResult;
  user: User;
  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
  constructor(private authService: AuthService, private userService: UserService) { }

  ngOnInit() {
    // if (this.authService.isLoggedIn()) {
    //   this.getUserByEmail(this.authService.getUsername());
    // }
  }
  getUserByEmail(username: string): void {
    this.userService.getUserByEmail(username)
      .subscribe(data => {
        this.userResult = data;
        this.email = data.result.email;
        this.staffMemberId = data.result.staffMemberId;
      },
        err => console.log(err)
      );
  }
}
