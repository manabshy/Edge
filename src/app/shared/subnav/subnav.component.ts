import { Component, OnInit, HostBinding } from '@angular/core';

@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.component.html',
  styleUrls: ['./subnav.component.scss']
})
export class SubnavComponent implements OnInit {
  @HostBinding('class.list-group') true;
  constructor() { }

  ngOnInit() {
  }

}
