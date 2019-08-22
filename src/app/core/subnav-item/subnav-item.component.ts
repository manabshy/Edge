import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-subnav-item',
  templateUrl: './subnav-item.component.html',
  styleUrls: ['./subnav-item.component.scss']
})
export class SubnavItemComponent implements OnInit {
  @Input() navLink;
  @HostBinding('class.list-group-item')
  @HostBinding('class.list-group-item-action')
  @HostBinding('class.clearfix') true;
  constructor(private _router: Router) { }

  ngOnInit() {
  }

  @HostListener('click')
  onClick() {
    const baseLink = this._router.url.substring(0, this._router.url.indexOf('?')) || this._router.url;
    const link = baseLink + '/'+ this.navLink;
    window.open(link, '_blank');
  }

}
