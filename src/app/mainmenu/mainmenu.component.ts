import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { AuthService } from '../core/services/auth.service';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {
  navbarCollapsed = false;
  isLoggedIn: boolean;

  constructor(public router: Router, public _location: Location, public authService: AuthService) { }

  ngOnInit() {
  }

  backClicked() {
    this.navbarCollapsed = false;
  }

  logOut() {
    this.authService.signout();
  }

}
