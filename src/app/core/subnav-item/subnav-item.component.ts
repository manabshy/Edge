import { Component, OnInit, Input, HostBinding, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

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
  constructor(private _router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  @HostListener('click')
  onClick() {
    this._router.navigate(this.navLink, { relativeTo: this.route });
  }

}
