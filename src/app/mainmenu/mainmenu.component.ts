import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-mainmenu',
  templateUrl: './mainmenu.component.html',
  styleUrls: ['./mainmenu.component.scss']
})
export class MainmenuComponent implements OnInit {
  navbarCollapsed = false;

  constructor(private router: Router, private _location: Location) { }

  ngOnInit() {
  }

  backClicked() {
    this._location.back();
    this.navbarCollapsed = false;
  }

}
