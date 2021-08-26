import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, EMPTY } from "rxjs";
import { ValuationService } from "./shared/valuation.service";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  takeUntil,
  tap,
} from "rxjs/operators";
import {
  Valuation,
  ValuationRequestOption,
  ValuationStatusEnum,
  getValuationStatuses,
  ValuationStatuses,
} from "./shared/valuation";
import { WedgeError, SharedService } from "../core/services/shared.service";
import { StorageMap } from "@ngx-pwa/local-storage";
import { StaffMember, Office } from "../shared/models/staff-member";
import { BaseComponent } from "../shared/models/base-component";
import { StaffMemberService } from "../core/services/staff-member.service";
import { OfficeService } from "../core/services/office.service";
import { format } from "date-fns";
import { BaseStaffMember } from "../shared/models/base-staff-member";

@Component({
  selector: "app-valuations",
  templateUrl: "./valuations.component.html",
  styleUrls: ["./valuations.component.scss"],
})
export class ValuationsComponent extends BaseComponent implements OnInit {
  valuationFinderForm: FormGroup;
  valuations: Valuation[] = [];
  searchTerm = "";
  suggestedTerm = "";
  listerId = 0;
  officeId = 0;
  status = 0;
  isMessageVisible: boolean;
  isHintVisible: boolean;
  page: number;
  bottomReached = false;
  suggestions: (text$: Observable<any>) => Observable<any>;
  valuers: StaffMember[];
  offices: Office[];
  statuses: any;
  isAdvancedSearchVisible: boolean = false;
  queryResultCount: number;
  get searchTermControl() {
    return this.valuationFinderForm.get("searchTerm") as FormControl;
  }
  get dateControl() {
    return this.valuationFinderForm.get("date") as FormControl;
  }
  get statusControl() {
    return this.valuationFinderForm.get("statusId") as FormControl;
  }
  get valuerControl() {
    return this.valuationFinderForm.get("valuerId") as FormControl;
  }
  get officeControl() {
    return this.valuationFinderForm.get("officeId") as FormControl;
  }

  get isAdvancedFilterActive() {
    if (this.valuationFinderForm) {
      return (
        +this.statusControl.value ||
        this.valuerControl.value ||
        this.officeControl.value
      );
    }
  }

  public keepOriginalOrder = (a) => a.key;

  constructor(
    private valuationService: ValuationService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService,
    private officeService: OfficeService,
    private storage: StorageMap,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.setupForm();
    this.getValuations();
    this.statuses = ValuationStatuses;

    this.storage.get("activeStaffmembers").subscribe((data) => {
      if (data) {
        this.valuers = data as StaffMember[];
      } else {
        this.staffMemberService
          .getActiveStaffMembers()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result) => (this.valuers = result));
      }
    });

    this.valuationService.valuationPageNumberChanges$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newPageNumber) => {
        this.page = newPageNumber;
        this.getNextValuationsPage(this.page);
        console.log("%c HEYYYY", "color: blue", this.page);
      });

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.valuationService.getValuationSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            })
          )
        )
      );
  }

  private setupForm() {
    this.valuationFinderForm = this.fb.group({
      searchTerm: "",
      date: null,
      statusId: 0,
      valuerId: 0,
      officeId: 0,
    });
  }

  getValuations() {
    this.page = 1;
    this.bottomReached = false;
    this.valuations = [];
    this.suggestedTerm
      ? (this.searchTerm = this.suggestedTerm)
      : (this.searchTerm = this.searchTermControl.value);
    this.getNextValuationsPage(this.page);
  }

  getNextValuationsPage(page: number) {
    const request = {
      page: page,
      searchTerm: this.searchTerm,
      date:
        this.dateControl.value === null
          ? null
          : format(this.dateControl.value, "YYYY-MM-DD"),
      status: this.statusControl.value,
      valuerId: this.valuerControl.value,
      officeId: this.officeControl.value,
    } as ValuationRequestOption;

    this.valuationService
      .getValuations(request)
      .pipe(
        tap((res) => console.log("res", res)),
        distinctUntilChanged()
      )
      .subscribe(
        (result) => {
          if (this.searchTerm && this.searchTerm.length) {
            if (result && !result.length) {
              this.isMessageVisible = true;
              this.bottomReached = true;
            } else {
              this.isMessageVisible = false;
            }
          }
          if (result && result.length) {
            this.queryResultCount = result[0].queryResultCount;
            if (request.page === 1) {
              this.isAdvancedSearchVisible = false;
              this.valuations = result;
            } else {
              this.valuations = this.valuations.concat(result);
            }
          }
        },
        (error: WedgeError) => {
          this.valuations = [];
          this.searchTerm = "";
          this.isHintVisible = true;
        }
      );
  }

  suggestionSelected(event) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
      console.log("suggestion", this.suggestedTerm);
    }
    this.getValuations();
    this.suggestedTerm = "";
  }

  getSelectedOfficeId(id: number) {
    this.officeControl.setValue(id);
  }

  getSelectedStaffMemberId(id: number) {
    console.log("valuer id here", id);
    this.valuerControl.setValue(id);
  }

  scrollElIntoView(className: string) {
    this.sharedService.scrollElIntoView(className);
  }
}
