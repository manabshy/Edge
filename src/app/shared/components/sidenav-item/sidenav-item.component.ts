import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { SideNavItem, SidenavService } from 'src/app/core/services/sidenav.service';
import { PropertySummaryFigures } from 'src/app/property/shared/property';

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})
export class SidenavItemComponent implements OnInit {

  @Input() summaryTotals: PropertySummaryFigures;
  @Input() sideNavItems: SideNavItem[] = [];
  @Input() scrollToItem = '';
  @Output() selectedItem = new EventEmitter<any>();

  constructor(private sidenavService: SidenavService) { }

  ngOnInit(): void {
  }

  isObject(val: any) {
    return val instanceof Object;
  }

  setSideNavItem(type: string, index: number) {
    this.selectedItem.emit({ type, index });
  }

  scrollTo(el: HTMLElement) {
    this.sidenavService.scrollTo(el);
  }
}
