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
  @Output() create = new EventEmitter<string>();

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
    if (el) {
      this.sidenavService.scrollTo(el);
    }
  }

  createNewItem(event: any, type: string) {
    event.stopPropagation();
    this.create.emit(type?.toLowerCase());
  }
}
