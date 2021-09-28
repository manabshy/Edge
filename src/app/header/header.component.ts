import {
  Component,
  ElementRef,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { ActivatedRoute, NavigationEnd, Router } from "@angular/router";
import { MenuItem, PrimeNGConfig } from "primeng/api";
import { DynamicDialogRef } from "primeng/dynamicdialog";
import { filter, takeUntil } from "rxjs/operators";
import { AuthService } from "../core/services/auth.service";
import { HeaderService } from "../core/services/header.service";
import { BaseComponent } from "../shared/models/base-component";
import { BaseStaffMember } from "../shared/models/base-staff-member";
import { StaffMember } from "../shared/models/staff-member";
import { Menu } from "primeng/menu";
import { SharedService } from "../core/services/shared.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.scss"],
})
export class HeaderComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  currentStaffMember: StaffMember;
  navTitle: string;
  headerLabel: string;
  showImpersonation = false;
  impersonatedStaffMember: BaseStaffMember;
  ref: DynamicDialogRef;
  isImpersonating = false;
  showMenuEditItem = false;
  items: MenuItem[];
  filteredItems: MenuItem[];
  openContactGroupSubscription = new Subscription();

  @HostListener("document:click", ["$event"])
  clickout(event) {
    if (this.menu) this.menu.hide();
  }

  @ViewChild("menu", { static: false }) menu: Menu;

  constructor(
    public authService: AuthService,
    private headerService: HeaderService,
    private route: ActivatedRoute,
    private router: Router,
    private sharedService: SharedService,
    private primengConfig: PrimeNGConfig
  ) {
    super();
    this.setRouteTitle();
  }

  private setRouteTitle() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(() => {
        const childRoute = this.getChildRoute(this.route);
        childRoute.data.subscribe((route) => {
          console.log("title and route", route);
          this.navTitle = route?.title;
          this.showMenuEditItem = route?.showMenuEditItem;

          this.setItems(this.navTitle);
        });
      });
  }

  ngOnInit(): void {
    this.getLabel();

    this.primengConfig.ripple = true;

    this.openContactGroupSubscription = this.sharedService.openContactGroupChanged.subscribe(
      (value) => {
        if (!value) {
          this.filteredItems = [
            ...this.items.filter((x) => x.id !== "addAdmin"),
          ];
        }
      }
    );
    this.openContactGroupSubscription = this.sharedService.removeContactGroupChanged.subscribe(
      (value) => {
        if (!value) {
          this.filteredItems = [
            ...this.items.filter((x) => x.id !== "removeAdmin"),
          ];
        }
      }
    );
  }

  setItems(navTitle: string) {
    if (navTitle == "Valuation") {
      this.items = [
        {
          id: "addAdmin",
          label: "Add Admin Contact",
          icon: "pi pi-plus",
          command: () => {
            this.sharedService.openContactGroupChanged.next(true);
          },
        },
        {
          id: "removeAdmin",
          label: "Remove Admin Contact",
          icon: "pi pi-minus",
          command: () => {
            this.sharedService.removeContactGroupChanged.next(true);
          },
        },
        {
          label: "Sales Terms of Business",
          icon: "pi pi-file-pdf",
          command: () => {
            this.sharedService.openContactGroupChanged.next(true);
          },
        },
        {
          label: "Lettings Terms of Business",
          icon: "pi pi-file-pdf",
          command: () => {
            this.sharedService.openContactGroupChanged.next(true);
          },
        },
        {
          label: "Land Lord Questionnaire",
          icon: "pi pi-chart-bar",
          command: () => {
            this.sharedService.openContactGroupChanged.next(true);
          },
        },
        {
          label: "Vendor Questionnaire",
          icon: "pi pi-chart-bar",
          command: () => {
            this.sharedService.openContactGroupChanged.next(true);
          },
        },
        {
          id: "cancelValuation",
          label: "Cancel Valuation",
          icon: "pi pi-ban",
          command: () => {
            this.sharedService.cancelValuationChanged.next(true);
          },
        },
      ];

      this.filteredItems = this.items.slice();
    }
  }

  getChildRoute(route: ActivatedRoute): ActivatedRoute {
    if (route.firstChild) {
      return this.getChildRoute(route.firstChild);
    } else {
      return route;
    }
  }

  getLabel() {
    this.headerService.label$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((label) => (this.headerLabel = label));
  }

  ngOnDestroy() {
    this.openContactGroupSubscription.unsubscribe();
  }
}
