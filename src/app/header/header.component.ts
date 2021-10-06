import {
  ValuationStatusEnum,
  ValuationTypeEnum,
} from "./../valuations/shared/valuation";
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
import { combineLatest, Subscription } from "rxjs";
import { eSignTypes } from "../core/shared/eSignTypes";

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
  valuationStatusSubscription = new Subscription();

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

    // Sales ToB, Lettings ToB, Sales Property Questionnaire, Lettings Property Questionnaire, Close Valuation
    combineLatest([
      this.sharedService.valuationStatusChanged,
      this.sharedService.valuationType,
      this.sharedService.openContactGroupChanged,
      this.sharedService.removeContactGroupChanged,
    ]).subscribe(
      ([
        valuationStatus,
        valuationType,
        openContactGroup,
        removeContactGroup,
      ]) => {
        if (this.items) {
          if (valuationStatus === ValuationStatusEnum.None) {
            this.filteredItems = [
              ...this.items.filter((x) => x.id === "addAdmin"),
            ];
          } else if (valuationStatus === ValuationStatusEnum.Booked)
            this.filteredItems = [
              ...this.items.filter(
                (x) => x.id === "cancelValuation" || x.id === "addAdmin"
              ),
            ];
          else if (valuationStatus === ValuationStatusEnum.Valued) {
            if (valuationType === ValuationTypeEnum.Lettings) {
              this.filteredItems = [
                ...this.items.filter(
                  (x) =>
                    x.id === "lettingsTermsOfBusiness" ||
                    x.id === "cancelValuation" ||
                    x.id === "addAdmin" ||
                    x.id === "landLordQuestionnaire"
                ),
              ];
            } else if (valuationType === ValuationTypeEnum.Sales) {
              this.filteredItems = [
                ...this.items.filter(
                  (x) =>
                    x.id === "salesTermsOfBusiness" ||
                    x.id === "cancelValuation" ||
                    x.id === "addAdmin" ||
                    x.id === "vendorQuestionnaire"
                ),
              ];
            }
          } else if (valuationStatus === ValuationStatusEnum.Instructed) {
            if (valuationType === ValuationTypeEnum.Lettings) {
              this.filteredItems = [
                ...this.items.filter((x) => x.id === "landLordQuestionnaire"),
              ];
            } else if (valuationType === ValuationTypeEnum.Sales) {
              this.filteredItems = [
                ...this.items.filter((x) => x.id === "vendorQuestionnaire"),
              ];
            }
          }

          if (removeContactGroup != null && !removeContactGroup) {
            this.filteredItems = [
              ...this.filteredItems.filter((x) => x.id !== "removeAdmin"),
            ];
          }
          if (openContactGroup != null && !openContactGroup) {
            this.filteredItems = [
              ...this.filteredItems.filter((x) => x.id !== "addAdmin"),
            ];
          }
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
          id: "salesTermsOfBusiness",
          label: "Sales Terms of Business",
          icon: "pi pi-file-pdf",
          command: () => {
            this.sharedService.eSignTriggerChanged.next(
              eSignTypes.Sales_Terms_Of_Business
            );
          },
        },
        {
          id: "lettingsTermsOfBusiness",
          label: "Lettings Terms of Business",
          icon: "pi pi-file-pdf",
          command: () => {
            this.sharedService.eSignTriggerChanged.next(
              eSignTypes.Lettings_Terms_Of_Business
            );
          },
        },
        {
          id: "landLordQuestionnaire",
          label: "Land Lord Questionnaire",
          icon: "pi pi-file-pdf",
          command: () => {
            this.sharedService.eSignTriggerChanged.next(
              eSignTypes.Property_Questionnaire
            );
          },
        },
        {
          id: "vendorQuestionnaire",
          label: "Vendor Questionnaire",
          icon: "pi pi-file-pdf",
          command: () => {
            this.sharedService.eSignTriggerChanged.next(
              eSignTypes.Sales_Property_Questionnaire
            );
          },
        },
        {
          id: "cancelValuation",
          label: "Cancel Valuation",
          icon: "pi pi-ban",
          command: () => {
            this.sharedService.cancelValuationOperationChanged.next(true);
          },
        },
      ];
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
    this.valuationStatusSubscription.unsubscribe();
  }
}
