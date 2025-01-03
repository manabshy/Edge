import { Component, OnInit, Input, HostBinding, HostListener, OnChanges } from '@angular/core';
import { Router } from '@angular/router';
import { SharedService } from '../../core/services/shared.service';

@Component({
  selector: 'app-subnav-item',
  templateUrl: './subnav-item.component.html',
  styleUrls: ['./subnav-item.component.scss']
})
export class SubnavItemComponent implements OnChanges {
  @Input() navLink;
  @Input() noBaseLink = false;
  @Input() params;
  @Input() target;
  @HostBinding('class.list-group-item')
  @HostBinding('class.list-group-item-action')
  @HostBinding('class.clearfix') true;
  link: string;
  constructor(private _router: Router, private sharedService: SharedService) { }

  ngOnChanges() {
    if(this.navLink) {
      if(this.noBaseLink){
        this.link = this.navLink;
      } else {
        const baseLink = this._router.url.substring(0, this._router.url.indexOf('?')) || this._router.url;
        this.link = '/'+baseLink + '/'+ this.navLink;
      }
    }
  }

  // @HostListener('click')
  // onClick() {
  //   this._router.navigateByUrl(this.link);
  // }

}
