import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SidenavService {
  selectedItem = '';
  sideNavItems: SideNavItem[] = [
    { name: 'notes', isCurrent: false },
    { name: 'contactGroups', isCurrent: false },
    { name: 'properties', isCurrent: false },
    { name: 'leads', isCurrent: false },
    { name: 'instructions', isCurrent: false },
    { name: 'valuations', isCurrent: false },
    { name: 'offers', isCurrent: false },
    { name: 'searches', isCurrent: false },
    { name: 'lettingsManagements', isCurrent: false },
    { name: 'homeHelpers', isCurrent: false }
  ];

  constructor() { }

  getSelectedItem(type: string, index: number, items?: SideNavItem[]) {
    if (items?.length) { this.sideNavItems = items; }

    this.sideNavItems.map(t => t.isCurrent = false);
    this.sideNavItems[index].isCurrent = true;
    console.log('selected item in service', this.selectedItem);
    return this.selectedItem = type;
  }

  resetCurrentFlag() {
    this.selectedItem = '';
    this.sideNavItems.forEach(x => {
      if (x.isCurrent) { x.isCurrent = false; }
    });
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView({ block: 'start', behavior: 'smooth' });
  }

}

export interface SideNavItem {
  name: string;
  isCurrent: boolean;
}
