import { Injectable } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class SidenavService {
  selectedItem = "";
  sideNavItems: SideNavItem[] = [
    { name: "notes", isCurrent: true },
    { name: "contactGroups", isCurrent: false },
    { name: "properties", isCurrent: false, showButton: true },
    { name: "leads", isCurrent: false, showButton: true },
    { name: "instructions", isCurrent: false },
    { name: "valuations", isCurrent: false },
    { name: "offers", isCurrent: false },
    { name: "searches", isCurrent: false },
    { name: "lettingsManagements", isCurrent: false },
    { name: "homeHelpers", isCurrent: false },
  ];

  valuationSideNavItems: SideNavItem[] = [
    { name: "valuationTicket", isCurrent: true },
    { name: "notes", isCurrent: false },
    // { name: "marketInsight", isCurrent: false },
  ];
  constructor() {}

  getSelectedItem(type: string, index: number, newItems?: SideNavItem[]) {
    let items: SideNavItem[];

    newItems?.length ? (items = newItems) : (items = this.sideNavItems);
    items.map((t) => (t.isCurrent = false));
    items[index].isCurrent = true;
    return (this.selectedItem = type);
  }

  resetCurrentFlag() {
    this.selectedItem = "";
    this.sideNavItems.forEach((x) => {
      if (x.isCurrent) {
        x.isCurrent = false;
      }
    });
    this.valuationSideNavItems.forEach((x) => {
      if (x.isCurrent) {
        x.isCurrent = false;
      }
    });
  }

  scrollTo(el: HTMLElement) {
    el.scrollIntoView({ block: "start", behavior: "smooth" });
  }
}

export interface SideNavItem {
  name: string;
  isCurrent: boolean;
  showButton?: boolean;
}
