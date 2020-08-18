import { Component, OnInit } from '@angular/core';

import { AuthService } from 'src/app/core/services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private authService: AuthService, private route: Router) { }

  ngOnInit() {
  }
  logIn(): void {
    // this.authService.startAuthentication();
    // this.authService.handleRedirect()
    this.authService.completeAuthentication()
    this.authService.login()
    this.route.navigateByUrl('/');
  }
}
