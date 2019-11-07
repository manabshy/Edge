import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-subnav-item',
  templateUrl: './subnav-item.component.html',
  styleUrls: ['./subnav-item.component.scss']
})
export class SubnavItemComponent implements OnInit {
  @Input() navLink;
  @Input() params;
  @HostBinding('class.list-group-item')
  @HostBinding('class.list-group-item-action')
  @HostBinding('class.clearfix') true;
  link: string;
  constructor(private _router: Router, private sharedService: SharedService) { }

  ngOnInit() {
    if(this.navLink) {
      const baseLink = this._router.url.substring(0, this._router.url.indexOf('?')) || this._router.url;
      this.link = '/'+baseLink + '/'+ this.navLink;
    }
  }

  // @HostListener('click')
  // onClick() {
  //   this._router.navigateByUrl(this.link);
  // }

}
