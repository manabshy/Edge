import { ValuationCancellationReasons } from "./../shared/valuation";
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  ElementRef,
} from "@angular/core";
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageMap } from "@ngx-pwa/local-storage";
import { ToastrService } from "ngx-toastr";
import {
  debounceTime,
  takeUntil,
  distinctUntilChanged,
  map,
} from "rxjs/operators";
import {
  ContactGroup,
  ContactNote,
  PersonSummaryFigures,
  Signer,
} from "src/app/contactgroups/shared/contact-group";
import { ContactGroupsService } from "src/app/contactgroups/shared/contact-groups.service";
import {
  DropdownListInfo,
  InfoDetail,
  InfoService,
} from "src/app/core/services/info.service";
import {
  SharedService,
  WedgeError,
} from "src/app/core/services/shared.service";
import { StaffMemberService } from "src/app/core/services/staff-member.service";
import { FormErrors } from "src/app/core/shared/app-constants";
import {
  MinBedrooms,
  OtherFeatures,
  Property,
  PropertyFeatures,
  PropertyType,
} from "src/app/property/shared/property";
import { PropertyService } from "src/app/property/shared/property.service";
import { BaseComponent } from "src/app/shared/models/base-component";
import { BaseProperty } from "src/app/shared/models/base-property";
import { BaseStaffMember } from "src/app/shared/models/base-staff-member";
import {
  Valuation,
  ValuationStatusEnum,
  ValuationPropertyInfo,
  Valuer,
  OfficeMember,
  ValuersAvailabilityOption,
  CalendarAvailibility,
  ValuationStaffMembersCalanderEvents,
  ValuationBooking,
  ValuationStatuses,
  CancelValuation,
} from "../shared/valuation";
import { ValuationService } from "../shared/valuation.service";
import { Instruction } from "src/app/shared/models/instruction";
import { ResultData } from "src/app/shared/result-data";
import { StaffMember } from "src/app/shared/models/staff-member";
import { TabDirective } from "ngx-bootstrap/tabs/ngx-bootstrap-tabs";
import format from "date-fns/format";
import { Observable, Subject, Subscription } from "rxjs";
import { MessageService, PrimeNGConfig } from "primeng/api";
import { addYears, differenceInCalendarYears, isThisHour } from "date-fns";
import _ from "lodash";
import { CurrencyPipe } from "@angular/common";
import { CustomDateFormatter } from "src/app/calendar-shared/custom-date-formatter.provider";
import { CustomEventTitleFormatter } from "src/app/calendar-shared/custom-event-title-formatter.provider";
import {
  CalendarDayViewBeforeRenderEvent,
  CalendarEvent,
} from "angular-calendar";
import { BasicEventRequest, DiaryProperty } from "src/app/diary/shared/diary";
import { DiaryEventService } from "src/app/diary/shared/diary-event.service";
import { SidenavService } from "src/app/core/services/sidenav.service";
import { Person } from "src/app/shared/models/person";
import moment from "moment";

@Component({
  selector: "app-valuation-detail-edit",
  templateUrl: "./valuation-detail-edit.component.html",
  styleUrls: ["./valuation-detail-edit.component.scss"],
})
export class ValuationDetailEditComponent
  extends BaseComponent
  implements OnInit, OnDestroy {
  showCalendar = false;
  valuationId: number;
  valuation: Valuation;
  lastKnownOwner: Signer;
  adminContact: Signer | null;
  valuationForm: FormGroup;
  tenures: InfoDetail[];
  outsideSpaces: InfoDetail[];
  parkings: InfoDetail[];
  features: InfoDetail[];
  selectedDate: Date;
  selectedSalesDate: Date;
  selectedLettingsDate: Date;
  createdSigner: any;
  isCreatingNewSigner: boolean;
  allStaffMembers: BaseStaffMember[] = [];
  mainStaffMember: BaseStaffMember;
  staffMemberId: number;
  isNewValuation: boolean = false;
  showOnlyMainStaffMember: boolean;
  errorMessage: WedgeError;
  isSubmitting: boolean;
  formErrors = FormErrors;
  property: Property;
  isOwnerChanged: boolean;
  isAdminContactChanged: boolean;
  isPropertyChanged: boolean;
  isEditable: boolean = false;
  showLeaseExpiryDate: boolean;
  canInstruct: boolean;
  canSaveValuation: boolean = true;
  propertyId: number;
  lastKnownOwnerId: number;
  approxLeaseExpiryDate: Date;
  instructionForm: FormGroup;
  instruction: Instruction;
  originTypes: InfoDetail[] = [];
  allOrigins: InfoDetail[] = [];
  origins: InfoDetail[] = [];
  origin: string;
  valuers: Valuer[] = [];
  lettingsValuers: OfficeMember[] = [];
  salesValuers: OfficeMember[] = [];
  allValuers: Valuer;
  // valuers: BaseStaffMember[] = [];
  showDateAndDuration: boolean;
  hasDateWithValuer = false;
  activeOriginId: InfoDetail;
  showOriginId: boolean;
  allOriginTypes: InfoDetail[] = [];
  associateTypes: InfoDetail[] = [];
  isSelectingDate = false;
  showInstruct: boolean;
  currentStaffMember: StaffMember;
  isClientService: boolean;
  activeOriginTypes: InfoDetail[] = [];
  isOriginUnknown = false;
  salesValuerLabel: string;
  lettingsValuerLabel: string;
  isSalesAndLettings: boolean;
  isSalesOnly: boolean;
  isLettingsOnly: boolean;
  isSales: boolean;
  isLettings: boolean;
  selectedValuerIdList = [];
  selectedValuerId: number;
  availabilityForm: FormGroup;
  availableDates: ValuationStaffMembersCalanderEvents;
  canBookAppointment = true;
  isAvailabilityRequired = false;
  oldClass: string = "null";
  contactGroup: ContactGroup;
  adminContactGroup: ContactGroup;
  contactGroupSubscription = new Subscription();
  showPhotos = false;
  showMap = false;
  showProperty = false;
  isLastknownOwnerVisible = false;
  isAdminContactVisible = false;
  isInstructVisible = false;
  accordionIndex: number;
  propertySubsription = new Subscription();

  salesMeetingOwner;
  lettingsMeetingOwner;
  salesOwnerAssociateName;
  salesOwnerAssociateContactNumber;
  salesOwnerAssociateEmail;
  salesOwnerAssociateType;
  lettingsOwnerAssociateName;
  lettingsOwnerAssociateContactNumber;
  lettingsOwnerAssociateEmail;
  lettingsOwnerAssociateType;
  isAppointmentVisible = false;
  lettingsValuerOpenSlots: ValuationStaffMembersCalanderEvents;
  salesValuerOpenSlots: ValuationStaffMembersCalanderEvents;
  isFromProperty = false;
  thisWeek: any[] = [];
  nextWeek: any[] = [];
  nextTwoWeek: any[] = [];
  warningForValuer = true;
  sideBarControlVisible = false;
  selectedCalendarDate: Date = null;
  viewingArrangements: InfoDetail[];
  secondStaffMemberId: number;
  selectedStaffMemberId: number = 0;
  isSalesEdit = false;
  isLettingsEdit = false;
  isBothEdit = true;
  isSplitAppointment = false;
  getTimeSalesValuationDate: number;
  getTimeLettingsValuationDate: number;
  todaysDate = new Date();
  defaultHours = [12, 13, 16, 17, 18, 19];
  defaultHoursForWeekend = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19];
  lettingsValuer: BaseStaffMember;
  salesValuer: BaseStaffMember;
  bookingButtonLabel = "Book For Sales and Lettings";
  propertyTypes: any[];
  propertyStyles: any[];
  propertyFloors: any[];
  allPropertyStyles: any[];
  activeValuations: Valuation[] = [];
  isActiveValuationsVisible = false;
  isCanDeactivate = false;
  openContactGroupSubscription = new Subscription();
  moreInfo = (this.sidenavService.selectedItem = "valuationTicket");
  summaryTotals: PersonSummaryFigures;
  sideNavItems = this.sidenavService.valuationSideNavItems;
  contactId: number;
  mainPersonId: number;
  showOnlyMyNotes: boolean = false;
  contactNotes: ContactNote[] = [];
  page = 0;
  pageSize = 20;
  bottomReached = false;
  isNoteSelected = false;
  person: Person;
  destroy = new Subject();
  showStudioLabel = false;
  isCancelValuationVisible = false;
  isCancelled = false;
  cancelString: string = "";
  cancelReasonString: string = "";

  // previousContactGroupId: number;
  get dataNote() {
    if (this.contactGroup?.contactGroupId) {
      return {
        contactGroupId: this.contactGroup.contactGroupId,
        people: this.contactGroup.contactPeople,
        notes: this.contactNotes,
      };
    }
    if (this.contactGroup) {
      return { contactGroupId: this.contactGroup, notes: this.contactNotes };
    }
    return null;
  }

  get originTypeControl() {
    return this.valuationForm.get("originType") as FormControl;
  }
  get valuationTypeControl() {
    return this.availabilityForm.get("type") as FormControl;
  }
  get originIdControl() {
    return this.valuationForm.get("originId") as FormControl;
  }
  get salesValuerIdControl() {
    return this.availabilityForm.get("salesValuerId") as FormControl;
  }
  get lettingsValuerIdControl() {
    return this.availabilityForm.get("lettingsValuerId") as FormControl;
  }
  get salesValuerControl() {
    return this.valuationForm.get("salesValuer") as FormControl;
  }
  get lettingsValuerControl() {
    return this.valuationForm.get("lettingsValuer") as FormControl;
  }

  get isInvitationSent() {
    return this.valuationForm.get("isInvitationSent") as FormControl;
  }

  get approxLeaseExpiryDateControl() {
    return this.valuationForm.get("approxLeaseExpiryDate") as FormControl;
  }
  get shortLetWeeklyControl() {
    return this.valuationForm.get("suggestedAskingRentShortLet") as FormControl;
  }
  get longLetWeeklyControl() {
    return this.valuationForm.get("suggestedAskingRentLongLet") as FormControl;
  }
  get shortLetMonthlyControl() {
    return this.valuationForm.get(
      "suggestedAskingRentShortLetMonthly"
    ) as FormControl;
  }
  get longLetMonthlyControl() {
    return this.valuationForm.get(
      "suggestedAskingRentLongLetMonthly"
    ) as FormControl;
  }

  get suggestedAskingPrice() {
    return this.valuationForm.get("suggestedAskingPrice") as FormControl;
  }

  get instAskingPriceControl() {
    return this.instructionForm.get("askingPrice") as FormControl;
  }
  get instShortLetWeeklyControl() {
    return this.instructionForm.get("askingRentShortLet") as FormControl;
  }
  get instLongLetWeeklyControl() {
    return this.instructionForm.get("askingRentLongLet") as FormControl;
  }
  get instShortLetMonthlyControl() {
    return this.instructionForm.get("askingRentShortLetMonthly") as FormControl;
  }
  get instLongLetMonthlyControl() {
    return this.instructionForm.get("askingRentLongLetMonthly") as FormControl;
  }
  get instructSaleControl() {
    return this.instructionForm.get("instructSale") as FormControl;
  }
  get instructLetControl() {
    return this.instructionForm.get("instructLet") as FormControl;
  }

  get rooms() {
    return MinBedrooms;
  }

  get areValuesVisible() {
    if (this.valuation) {
      return this.valuation.valuationStatus !== ValuationStatusEnum.None;
    }
  }

  activeState: boolean[] = [true, true, true, true, true, false, false];
  statuses = [
    { name: "valuationNotes", value: 0 },
    { name: "propertyInfo", value: 1 },
    { name: "appointment", value: 2 },
    { name: "values", value: 3 },
    { name: "termsOfBusinessues", value: 4 },
    { name: "antiMoneyLaundering", value: 5 },
    { name: "landRegistery", value: 6 },
    { name: "status", value: 7 },
    { name: "instruct", value: 8 },
  ];

  interestList: any[] = [];

  constructor(
    private valuationService: ValuationService,
    private propertyService: PropertyService,
    private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService,
    private toastr: ToastrService,
    private messageService: MessageService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private infoService: InfoService,
    private router: Router,
    private fb: FormBuilder,
    private currencyPipe: CurrencyPipe,
    private primengConfig: PrimeNGConfig,
    private diaryEventService: DiaryEventService,
    private sidenavService: SidenavService
  ) {
    super();
  }

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.setupForm();
    this.storage
      .get("currentUser")
      .subscribe((currentStaffMember: StaffMember) => {
        if (currentStaffMember) {
          // for testing purposes
          if (currentStaffMember.activeDepartments[0].departmentId === 90) {
            this.isClientService = true;
            this.setOriginTypeValidator();
            this.setOriginIdValidator();
          } else {
            this.isClientService = false;
            this.isOriginUnknown = true;
            this.originIdControl.setValue(1);
            this.origin = "Not Known";
          }
        }
      });
    this.setupInstructionForm();
    this.valuationId = +this.route.snapshot.paramMap.get("id");
    this.propertyId = +this.route.snapshot.queryParamMap.get("propertyId");
    this.lastKnownOwnerId = +this.route.snapshot.queryParamMap.get(
      "lastKnownOwnerId"
    );
    this.isNewValuation = (this.route.snapshot.queryParamMap.get(
      "isNewValuation"
    ) as unknown) as boolean;
    this.isFromProperty = (this.route.snapshot.queryParamMap.get(
      "isFromProperty"
    ) as unknown) as boolean;
    this.isNewValuation && !this.isFromProperty
      ? (this.showProperty = true)
      : (this.showProperty = false);
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    } else {
      this.valuation = { valuationStatus: ValuationStatusEnum.None };
      this.sharedService.removeContactGroupChanged.next(false);
    }

    if (this.propertyId) {
      this.getPropertyInformation(this.propertyId);
    }

    this.storage.get("info").subscribe((info: DropdownListInfo) => {
      if (info) {
        this.setupListInfo(info);
      } else {
        this.infoService
          .getDropdownListInfo()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: ResultData | any) => {
            if (data) {
              this.setupListInfo(data.result);
            }
          });
      }
    });

    this.getAddedProperty();

    this.contactGroupService.signer$.subscribe((data) => {
      if (data) {
        this.lastKnownOwner = data;
        this.createdSigner = data;
        this.isCreatingNewSigner = false;
      }
    });

    this.valuationForm.valueChanges.subscribe((data) => {
      this.valuationForm.patchValue(
        {
          suggestedAskingRentShortLetMonthly: data.suggestedAskingRentShortLetMonthly
            ? this.sharedService.transformCurrency(
                this.shortLetMonthlyControl.value
              )
            : "",
          suggestedAskingRentLongLetMonthly: data.suggestedAskingRentLongLetMonthly
            ? this.sharedService.transformCurrency(
                this.longLetMonthlyControl.value
              )
            : "",
          suggestedAskingPrice: data.suggestedAskingPrice
            ? this.sharedService.transformCurrency(
                this.suggestedAskingPrice.value
              )
            : "",
          suggestedAskingRentShortLet: data.suggestedAskingRentShortLet
            ? this.sharedService.transformCurrency(
                this.shortLetWeeklyControl.value
              )
            : "",
          suggestedAskingRentLongLet: data.suggestedAskingRentLongLet
            ? this.sharedService.transformCurrency(
                this.longLetWeeklyControl.value
              )
            : "",
        },
        { emitEvent: false }
      );
      this.sharedService.logValidationErrors(this.valuationForm, false);
      this.setRentFigures();
      this.checkAvailabilityBooking();
    });

    this.valuationForm.controls["lettingsMeetingOwner"].valueChanges.subscribe(
      (data) => {
        if (data == false) {
          this.setValidationForLettingsMeetingOwner(true);
        } else {
          this.setValidationForLettingsMeetingOwner(false);
        }
      }
    );

    this.valuationForm.controls["salesMeetingOwner"].valueChanges.subscribe(
      (data) => {
        if (data == false) {
          this.setValidationForSalesMeetingOwner(true);
        } else {
          this.setValidationForSalesMeetingOwner(false);
        }
      }
    );

    this.valuationForm.controls["propertyFloorId"].valueChanges.subscribe(
      (data) => {
        console.log("propertyFloorId = ", data);
        if (+data === 10) {
          this.setValidationForPropertyFloorOther(true);
        } else {
          this.setValidationForPropertyFloorOther(false);
        }
      }
    );

    this.instructionForm.valueChanges
      .pipe(debounceTime(100), distinctUntilChanged())
      .subscribe((form) => {
        this.instructionForm.patchValue(
          {
            askingPrice: form.askingPrice
              ? this.sharedService.transformCurrency(
                  this.instAskingPriceControl.value
                )
              : "",
            askingRentLongLet: form.askingRentLongLet
              ? this.sharedService.transformCurrency(
                  this.instLongLetWeeklyControl.value
                )
              : "",
            askingRentLongLetMonthly: form.askingRentLongLetMonthly
              ? this.sharedService.transformCurrency(
                  this.instLongLetMonthlyControl.value
                )
              : "",
            askingRentShortLet: form.askingRentShortLet
              ? this.sharedService.transformCurrency(
                  this.instShortLetWeeklyControl.value
                )
              : "",
            askingRentShortLetMonthly: form.askingRentShortLetMonthly
              ? this.sharedService.transformCurrency(
                  this.instShortLetMonthlyControl.value
                )
              : "",
          },
          { emitEvent: false }
        );
        this.sharedService.logValidationErrors(this.instructionForm, false);
        this.setInstructionRentFigures();
      });

    // availability form
    this.availabilityForm = this.fb.group({
      fromDate: [new Date(), Validators.required],
      salesValuerId: [null, Validators.required],
      lettingsValuerId: [null, Validators.required],
      type: "both",
    });

    this.toggleValuerType();
    this.availabilityForm.valueChanges.subscribe((data) => {
      this.sharedService.logValidationErrors(this.availabilityForm, false);
    });

    this.availabilityForm.controls["type"].valueChanges.subscribe((data) => {
      this.toggleValuerType();
    });

    this.storage.get("info").subscribe((data: DropdownListInfo) => {
      if (data) {
        this.viewingArrangements = data.viewingArrangements;
      }
    });

    this.openContactGroupSubscription = this.sharedService.openContactGroupChanged.subscribe(
      (value) => {
        if (value) {
          this.isAdminContactVisible = value;
        }
      }
    );

    this.openContactGroupSubscription = this.sharedService.removeContactGroupChanged.subscribe(
      (value) => {
        if (value) {
          this.removeAdminContact();
        }
      }
    );

    this.openContactGroupSubscription = this.sharedService.cancelValuationOperationChanged.subscribe(
      (value) => {
        this.isCancelValuationVisible = value;
      }
    );

    this.contactGroupService.noteChanges$.subscribe((data) => {
      if (data) {
        this.contactNotes = [];
        this.page = 1;
        if (this.contactId) {
          this.getContactNotes();
        }
      }
    });

    this.valuationService.contactGroupBs.subscribe((result: ContactGroup) => {
      if (result?.contactGroupId && this.contactId != result?.contactGroupId) {
        this.contactId = result.contactGroupId;
        this.getContactNotes();
      }
    });

    this.contactGroupService.contactNotePageChanges$
      .pipe(takeUntil(this.destroy))
      .subscribe((newPageNumber) => {
        this.page = newPageNumber;
        if (this.contactId == null) {
          this.page = 0;
        }
        this.getNextContactNotesPage(this.page);
      });
  }

  scrollSpecificElement(className: string) {
    const scrollElement = document.getElementsByClassName(className);
    if (scrollElement) {
      this.sharedService.scrollElIntoView(className);
    }
  }

  removeAdminContact() {
    this.adminContact = null;
    this.isAdminContactChanged = true;
    this.valuationForm.get("adminContact").setValue(this.adminContact);
    this.adminContactGroup = null;
    this.sharedService.removeContactGroupChanged.next(false);
  }

  setShowMyNotesFlag(onlyMyNotes: boolean) {
    this.showOnlyMyNotes = onlyMyNotes;
    this.contactNotes = [];
    this.page = 0;
    this.getContactNotes();
  }

  getContactNotes() {
    this.contactNotes = [];
    this.getNextContactNotesPage(this.page);
  }

  addNote() {
    console.log(this.dataNote, "data note...");

    this.sharedService.addNote(this.dataNote);
  }

  private getNextContactNotesPage(page: number) {
    if (this.contactId) {
      this.contactGroupService
        .getContactGroupNotes(
          this.contactId,
          this.pageSize,
          page,
          this.showOnlyMyNotes
        )
        .subscribe((data) => {
          if (data) {
            if (page === 1) {
              this.contactNotes = data;
            } else {
              this.contactNotes = _.concat(this.contactNotes, data);
            }
          }
          this.setBottomReachedFlag(data);
        });
    }
  }

  private setBottomReachedFlag(result: any) {
    if (result && (!result.length || result.length < +this.pageSize)) {
      this.bottomReached = true;
    } else {
      this.bottomReached = false;
    }
  }

  getSelectedSideNavItem(event) {
    this.moreInfo = this.sidenavService.getSelectedItem(
      event?.type,
      event?.index,
      this.sideNavItems
    );
    if (event?.type == "notes") {
      this.isNoteSelected = true;
    } else {
      this.isNoteSelected = false;
    }
  }

  getSelectedAdminContact(owner: Signer) {
    if (owner) {
      this.adminContact = {
        ...owner,
        ccOwner: this.valuation?.ccOwner,
        isPowerOfAttorney: this.valuation?.isPowerOfAttorney,
      };
      this.isAdminContactChanged = true;
      this.getAdminContactGroup(this.adminContact?.contactGroupId);
      this.valuationForm.get("adminContact").setValue(this.adminContact);
      this.isAdminContactVisible = false;
      this.sharedService.openContactGroupChanged.next(false);
    }
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      this.isOwnerChanged = true;
      this.isLastknownOwnerVisible = false;
      this.getContactGroup(this.lastKnownOwner?.contactGroupId).then(
        (result) => {
          this.contactGroup = result;
          this.valuationService.contactGroupBs.next(this.contactGroup);
          this.getSearchedPersonSummaryInfo(this.contactGroup);
        }
      );
      this.valuationForm.get("propertyOwner").setValue(owner);
      if (this.property) {
        this.property.lastKnownOwner = owner;
      }
      if (this.isEditable || this.isNewValuation) {
        this.valuationForm.markAsDirty();
      }
      this.isAdminContactChanged = false;
    }
  }

  setValidationForLettingsMeetingOwner(setValidation: boolean) {
    this.valuationForm.controls["lettingsOwnerAssociateEmail"].setValidators(
      setValidation ? Validators.required : []
    );
    this.valuationForm.controls[
      "lettingsOwnerAssociateEmail"
    ].updateValueAndValidity();

    this.valuationForm.controls["lettingsOwnerAssociateName"].setValidators(
      setValidation ? Validators.required : []
    );
    this.valuationForm.controls[
      "lettingsOwnerAssociateName"
    ].updateValueAndValidity();

    this.valuationForm.controls[
      "lettingsOwnerAssociateContactNumber"
    ].setValidators(setValidation ? Validators.required : []);
    this.valuationForm.controls[
      "lettingsOwnerAssociateContactNumber"
    ].updateValueAndValidity();
  }

  setValidationForSalesMeetingOwner(setValidation: boolean) {
    this.valuationForm.controls["salesOwnerAssociateEmail"].setValidators(
      setValidation ? Validators.required : []
    );
    this.valuationForm.controls[
      "salesOwnerAssociateEmail"
    ].updateValueAndValidity();

    this.valuationForm.controls["salesOwnerAssociateName"].setValidators(
      setValidation ? Validators.required : []
    );
    this.valuationForm.controls[
      "salesOwnerAssociateName"
    ].updateValueAndValidity();

    this.valuationForm.controls[
      "salesOwnerAssociateContactNumber"
    ].setValidators(setValidation ? Validators.required : []);
    this.valuationForm.controls[
      "salesOwnerAssociateContactNumber"
    ].updateValueAndValidity();
  }

  setValidationForPropertyFloorOther(isRequired: boolean) {
    console.log("setValidationForPropertyFloorOther: ", isRequired);
    this.valuationForm.controls["floorOther"].setValidators(
      isRequired ? Validators.required : []
    );
    if (!isRequired) {
      this.valuationForm.controls["floorOther"].setValue(null);
    }
    this.valuationForm.controls["floorOther"].updateValueAndValidity();
  }

  selectValuersClick() {
    this.sideBarControlVisible = true;
    this.thisWeek = [];
    this.nextWeek = [];
    this.nextTwoWeek = [];
    this.showCalendar = false;
  }

  toggleValuerType() {
    switch (this.valuationTypeControl.value) {
      case "sales":
        this.isSalesOnly = true;
        this.isLettingsOnly = false;
        this.isSalesAndLettings = false;
        this.availabilityForm.controls["lettingsValuerId"].setValidators(null);
        this.availabilityForm.controls["salesValuerId"].setValidators(
          Validators.required
        );
        this.bookingButtonLabel = "Book For Sales";
        break;
      case "lettings":
        this.isLettingsOnly = true;
        this.isSalesOnly = false;
        this.isSalesAndLettings = false;
        this.availabilityForm.controls["salesValuerId"].setValidators(null);
        this.availabilityForm.controls["lettingsValuerId"].setValidators(
          Validators.required
        );
        this.bookingButtonLabel = "Book For Lettings";
        break;

      default:
        this.isSalesAndLettings = true;
        this.isLettingsOnly = false;
        this.isSalesOnly = false;
        this.availabilityForm.controls["lettingsValuerId"].setValidators(
          Validators.required
        );
        this.availabilityForm.controls["salesValuerId"].setValidators(
          Validators.required
        );
        this.bookingButtonLabel = "Book For Sales and Lettings";
        break;
    }
    this.isSplitAppointment = false;
    this.availabilityForm.controls["salesValuerId"].updateValueAndValidity();
    this.availabilityForm.controls["lettingsValuerId"].updateValueAndValidity();
  }

  onSplitAppointmentChange(event) {
    this.isSplitAppointment = event.checked;
    this.valuation.salesValuationBooking = null;
    this.valuation.lettingsValuationBooking = null;
    this.selectedSalesDate = null;
    this.selectedLettingsDate = null;
    this.selectedDate = null;
    if (this.isSplitAppointment) this.bookingButtonLabel = "Book For Sales";
    else this.bookingButtonLabel = "Book For Sales and Lettings";
  }

  onSelectActiveValuation(valuation) {
    this.isCanDeactivate = true;

    this.router
      .navigateByUrl("/", { skipLocationChange: false })
      .then(() =>
        this.router.navigate([
          "valuations-register/detail/",
          valuation?.data?.valuationEventId,
          "edit",
        ])
      );
  }

  private setupListInfo(info: DropdownListInfo) {
    this.tenures = info.tenures;
    this.outsideSpaces = info.outsideSpaces;
    this.parkings = info.parkings;
    this.features = info.propertyFeatures;
    this.allOrigins = info.origins;
    this.allOriginTypes = info.originTypes;
    this.setOriginTypes(info.originTypes); // TODO: Issue on refresh
    this.interestList = info.section21Statuses;
    this.associateTypes = info.associations;
    this.propertyTypes = info.propertyTypes;
    this.allPropertyStyles = info.propertyStyles;
    this.propertyStyles = info.propertyStyles;
    this.propertyFloors = info.propertyFloors;
  }

  getPropertyDetails(propertyId: number) {
    this.propertySubsription = this.propertyService
      .getProperty(propertyId, true, true, false, true)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        if (result) {
          this.setPropertyDetail(result);
        }
      });
  }

  getPropertyDetailsPromise(propertyId: number) {
    return this.propertyService
      .getProperty(propertyId, true, true, false, true)
      .pipe(takeUntil(this.ngUnsubscribe))
      .toPromise();
  }

  setPropertyDetail(propertyDetails) {
    if (propertyDetails.lastKnownOwner)
      this.lastKnownOwner = propertyDetails.lastKnownOwner;
    this.property = propertyDetails;
    this.valuation.property = { ...this.property };
    this.valuation.officeId = this.property.officeId;
    // this.valuers = result.valuers;
    this.getContactGroup(this.lastKnownOwner?.contactGroupId).then((result) => {
      this.contactGroup = result;
      this.valuationService.contactGroupBs.next(this.contactGroup);
      this.getSearchedPersonSummaryInfo(this.contactGroup);
    });

    const baseProperty = {
      propertyId: this.property.propertyId,
      address: this.property.address,
      officeId: this.property.officeId,
    } as BaseProperty;
    this.valuationForm.get("property").setValue(baseProperty);

    this.valuationForm.patchValue({
      propertyStyleId: this.property.propertyStyleId,
      propertyTypeId: this.property.propertyTypeId,
      propertyFloorId: this.property["propertyFloorId"],
    });
  }

  getContactGroup(contactGroupId: number) {
    return this.contactGroupService
      .getContactGroupById(contactGroupId, true)
      .toPromise();
  }

  getAdminContactGroup(contactGroupId: number) {
    this.contactGroupSubscription = this.contactGroupService
      .getContactGroupById(contactGroupId, true)
      .subscribe((result) => {
        this.adminContactGroup = result;
        if (
          this.adminContactGroup.contactPeople &&
          this.adminContactGroup.contactPeople.length > 0
        ) {
          this.adminContactGroup.contactPeople[0].isAdminContact = true;
        }
        this.adminContactGroup.contactPeople = this.adminContactGroup.contactPeople.concat(
          this.contactGroup?.contactPeople
        );
        console.log(this.adminContactGroup.contactPeople);
      });
  }

  setInstructionRentFigures() {
    if (this.instShortLetWeeklyControl.value) {
      this.setMonthlyRent(
        this.instShortLetWeeklyControl,
        this.instShortLetMonthlyControl
      );
    }
    if (this.instLongLetWeeklyControl.value) {
      this.setMonthlyRent(
        this.instLongLetWeeklyControl,
        this.instLongLetMonthlyControl
      );
    }
    if (this.instShortLetMonthlyControl.value) {
      this.setWeeklyRent(
        this.instShortLetWeeklyControl,
        this.instShortLetMonthlyControl
      );
    }
    if (this.instLongLetMonthlyControl.value) {
      this.setWeeklyRent(
        this.instLongLetWeeklyControl,
        this.instLongLetMonthlyControl
      );
    }
  }

  setupInitialRentFigures(val: Valuation) {
    if (
      val.suggestedAskingRentShortLet &&
      !val.suggestedAskingRentShortLetMonthly
    ) {
      this.shortLetMonthlyControl.setValue(
        this.calculateMonthlyRent(+val.suggestedAskingRentShortLet)
      );
    }
    if (
      val.suggestedAskingRentLongLet &&
      !val.suggestedAskingRentLongLetMonthly
    ) {
      this.longLetMonthlyControl.setValue(
        this.calculateMonthlyRent(+val.suggestedAskingRentLongLet)
      );
    }
    if (
      val.suggestedAskingRentShortLetMonthly &&
      !val.suggestedAskingRentShortLet
    ) {
      this.shortLetWeeklyControl.setValue(
        this.calculateWeeklyRent(+val.suggestedAskingRentShortLetMonthly)
      );
    }
    if (
      val.suggestedAskingRentLongLetMonthly &&
      !val.suggestedAskingRentLongLet
    ) {
      this.longLetWeeklyControl.setValue(
        this.calculateMonthlyRent(+val.suggestedAskingRentLongLetMonthly)
      );
    }
  }

  setRentFigures() {
    if (this.shortLetWeeklyControl.value) {
      this.setMonthlyRent(
        this.shortLetWeeklyControl,
        this.shortLetMonthlyControl
      );
    }
    if (this.shortLetMonthlyControl.value) {
      this.setWeeklyRent(
        this.shortLetWeeklyControl,
        this.shortLetMonthlyControl
      );
    }
    if (this.longLetWeeklyControl.value) {
      this.setMonthlyRent(
        this.longLetWeeklyControl,
        this.longLetMonthlyControl
      );
    }
    if (this.longLetMonthlyControl.value) {
      this.setWeeklyRent(this.longLetWeeklyControl, this.longLetMonthlyControl);
    }
  }

  private setMonthlyRent(
    weeklyControl: FormControl,
    monthlyControl: FormControl
  ) {
    weeklyControl.valueChanges.subscribe((rent) => {
      rent = this.sharedService.convertStringToNumber(rent);
      monthlyControl.setValue(this.calculateMonthlyRent(rent), {
        emitEvent: false,
      });
    });
  }

  private setWeeklyRent(
    weeklyControl: FormControl,
    monthlyControl: FormControl
  ) {
    monthlyControl.valueChanges.subscribe((rent) => {
      rent = this.sharedService.convertStringToNumber(rent);
      weeklyControl.setValue(this.calculateWeeklyRent(rent), {
        emitEvent: false,
      });
    });
  }

  calculateMonthlyRent(rent: number): string {
    let monthlyRent: string;
    if (rent > 0) {
      monthlyRent = (rent * (52 / 12)).toFixed(0);
    }
    return monthlyRent;
  }

  calculateWeeklyRent(rent: number): string {
    let weeklyRent: string;
    if (rent > 0) {
      weeklyRent = (rent * (12 / 52)).toFixed(0);
    }
    return weeklyRent;
  }

  setupForm() {
    this.valuationForm = this.fb.group({
      property: [""],
      propertyOwner: [""],
      originType: [0],
      originId: [0],
      reason: ["", Validators.required],
      timeFrame: ["", Validators.required],
      generalNotes: ["", Validators.required],
      bedrooms: [0, Validators.max(99)],
      bathrooms: [0, Validators.max(99)],
      receptions: [0, Validators.max(99)],
      sqFt: [0],
      tenureId: [0],
      outsideSpace: [],
      parking: [],
      propertyFeature: [""],
      approxLeaseExpiryDate: [0, [Validators.max(999), Validators.min(0)]],
      salesValuer: [""],
      lettingsValuer: [""],
      isInvitationSent: true,
      totalHours: [1],
      valuationDate: [""],
      suggestedAskingPrice: [],
      suggestedAskingRentLongLet: [],
      suggestedAskingRentShortLet: [],
      suggestedAskingRentLongLetMonthly: [],
      suggestedAskingRentShortLetMonthly: [],
      declarableInterest: [null, Validators.required],
      ageOfSuggestedAskingPrice: [],
      section21StatusId: [],
      salesMeetingOwner: [true],
      lettingsMeetingOwner: [true],
      salesOwnerAssociateName: [""],
      salesOwnerAssociateContactNumber: [""],
      salesOwnerAssociateEmail: [""],
      salesOwnerAssociateType: ["6"],
      lettingsOwnerAssociateName: [""],
      lettingsOwnerAssociateContactNumber: [""],
      lettingsOwnerAssociateEmail: [""],
      lettingsOwnerAssociateType: ["6"],
      propertyStyleId: [],
      propertyTypeId: [],
      propertyFloorId: [],
      floorOther: [],
      isRetirementHome: [false],
      isNewBuild: [false],
      hasDisabledAccess: [false],
      adminContact: [],
    });
  }

  setupInstructionForm() {
    this.instructionForm = this.fb.group({
      instructSale: [false],
      instructLet: [false],
      salesAgencyType: [""],
      lettingsAgencyType: [""],
      askingPrice: [],
      askingRentLongLet: [],
      askingRentShortLet: [],
      askingRentLongLetMonthly: [],
      askingRentShortLetMonthly: [],
      isInstructLongLet: [],
      isInstructShortLet: [],
    });
  }

  private setValuersForSalesAndLettings() {
    this.salesValuers = this.allValuers.sales;
    this.lettingsValuers = this.allValuers.lettings;
  }

  getValuation(id: number) {
    this.valuationService
      .getValuation(id)
      .toPromise()
      .then((data) => {
        if (data) {
          this.valuation = data;
          console.log("this.valuation: ", this.valuation);
          this.getPropertyInformation(this.valuation.property.propertyId);

          this.valuation.valuationStatus === 3
            ? (this.canInstruct = true)
            : (this.canInstruct = false);
          this.valuation.approxLeaseExpiryDate
            ? (this.showLeaseExpiryDate = true)
            : (this.showLeaseExpiryDate = false);

          if (
            this.valuation.valuationStatus === ValuationStatusEnum.Cancelled
          ) {
            this.isCancelled = true;
            this.cancelString =
              "Cancelled " +
              moment(data.cancelledDate).format("Do MMM YYYY (HH:mm)") +
              " by " +
              data.cancelledBy?.fullName;
            this.cancelReasonString =
              "Reason for cancellation: " +
              (data.cancellationTypeId == ValuationCancellationReasons.Other
                ? data.cancellationReason
                : ValuationCancellationReasons[data.cancellationTypeId]);
          }
          if (
            this.valuation.valuationStatus === ValuationStatusEnum.Instructed ||
            this.valuation.valuationStatus === ValuationStatusEnum.Valued ||
            this.valuation.valuationStatus === ValuationStatusEnum.Cancelled
          ) {
            this.isEditable = false;
          } else {
            this.isEditable = true;
          }

          if (
            this.valuation.valuationStatus === ValuationStatusEnum.Instructed ||
            this.valuation.valuationStatus === ValuationStatusEnum.Cancelled
          ) {
            this.canSaveValuation = false;
          } else {
            this.canSaveValuation = true;
          }

          if (this.valuation.salesValuer || this.valuation.lettingsValuer) {
            if (this.isEditable) {
              if (this.valuation.valuationDate) {
                this.showDateAndDuration = true;
              } else {
                this.showDateAndDuration = false;
              }
            }
            this.salesValuerIdControl.setValue(
              this.valuation.salesValuer
                ? this.valuation.salesValuer.staffMemberId
                : null
            );
            this.lettingsValuerIdControl.setValue(
              this.valuation.salesValuer
                ? this.valuation.salesValuer.staffMemberId
                : null
            );
            if (this.valuation.combinedValuationBooking) {
              this.valuation.salesValuationBooking = {
                ...this.valuation.combinedValuationBooking,
              };
              this.valuation.lettingsValuationBooking = {
                ...this.valuation.combinedValuationBooking,
              };
            }
          }

          if (this.property) {
            this.lastKnownOwner = this.property.lastKnownOwner;
            this.property = this.property;
            this.getContactGroup(this.lastKnownOwner?.contactGroupId).then(
              (result) => {
                this.contactGroup = result;
                this.valuationService.contactGroupBs.next(this.contactGroup);
                this.getSearchedPersonSummaryInfo(this.contactGroup);
                this.setAdminContact();
              }
            ); // get contact group for last know owner
          } else {
            this.lastKnownOwner = this.valuation.propertyOwner;
            // this.property = this.valuation.property; // Fix this with Gabor on the API
            this.getPropertyDetailsPromise(
              this.valuation.property.propertyId
            ).then((result) => {
              if (result) {
                this.setPropertyDetail(result);
                this.setAdminContact();
              }
            });
          }

          if (this.property?.propertyId) {
            this.getValuers(this.property.propertyId);
          }

          this.setValuationType(data);
          this.populateForm(data);
          this.setupInitialRentFigures(data);

          if (this.valuation && this.allOrigins) {
            this.activeOriginId = this.allOrigins.find(
              (x) => x.id === +this.valuation.originId
            );
            this.activeOriginId && !this.isEditable
              ? (this.showOriginId = true)
              : (this.showOriginId = false);
            this.setOriginIdValue(this.valuation.originId);
          }

          if (this.valuation && this.allOrigins && this.originTypes) {
            this.setOriginTypeId(this.valuation.originId);
          }
        }
      })
      .then(() => {
        this.valuationService.getToBLink(id).subscribe((data) => {
          this.valuation.dateRequestSent = data.dateRequestSent;
          if (data.toBSales.length > data.toBLetting.length) {
            this.valuation.valuationFiles = data.toBSales;
            this.valuation.valuationType = 1;
          } else {
            this.valuation.valuationFiles = data.toBLetting;
            this.valuation.valuationType = 2;
          }
        });
      })
      .catch((err) => {
        console.log("err: ", err);
      });
  }

  controlIsCancelled($event) {
    if (this.isCancelled) {
      $event.preventDefault();
      return false;
    }
  }

  getSearchedPersonSummaryInfo(contactGroup: ContactGroup) {
    this.mainPersonId = this.contactGroup.contactPeople?.find(
      (x) => x.isMainPerson
    ).personId;
    this.contactId = contactGroup.contactGroupId;
    console.log(this.contactId);
    this.storage
      .get(this.mainPersonId.toString())
      .subscribe((data: PersonSummaryFigures) => {
        if (data) {
          this.summaryTotals = data;
        } else {
          this.contactGroupService
            .getPersonInfo(this.mainPersonId)
            .subscribe((data) => {
              this.summaryTotals = data;
              this.storage
                .set(this.mainPersonId.toString(), this.summaryTotals)
                .subscribe();
            });
        }
      });
  }

  // getPersonDetails(personId: number) {
  //   this.contactGroupService.getPerson(personId, true).subscribe((data) => {
  //     if (data) {
  //       this.person = data;
  //     }
  //   });
  // }

  setAdminContact() {
    if (
      this.valuation.adminContact &&
      this.valuation.adminContact.contactGroupId > 0
    )
      this.getSelectedAdminContact(this.valuation.adminContact);
    else this.sharedService.removeContactGroupChanged.next(false);
  }

  getPropertyInformation(propertyId) {
    this.propertyId = propertyId;
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId);
      this.getValuationPropertyInfo(this.propertyId);
      this.getValuers(this.propertyId);
    }
  }

  setValuationInformations(valuationBooking: ValuationBooking, type: string) {
    if (type == "both" || type == "sales") {
      this.salesMeetingOwner = valuationBooking.meetingOwner;
      this.salesOwnerAssociateName = valuationBooking.name;
      this.salesOwnerAssociateContactNumber = valuationBooking.contactNumber;
      this.salesOwnerAssociateEmail = valuationBooking.emailAddress;
      this.salesOwnerAssociateType = valuationBooking.associationId;
    } else if (type == "lettings") {
      this.lettingsMeetingOwner = valuationBooking.meetingOwner
        ? valuationBooking.meetingOwner
        : true;
      this.lettingsOwnerAssociateName = valuationBooking.name;
      this.lettingsOwnerAssociateContactNumber = valuationBooking.contactNumber;
      this.lettingsOwnerAssociateEmail = valuationBooking.emailAddress;
      this.lettingsOwnerAssociateType = valuationBooking.associationId;
    }

    // lettingsOwnerWantsMessage;
  }

  studioLabelCheck(bedroomCount) {
    this.showStudioLabel = bedroomCount == 0;
  }

  populateForm(valuation: Valuation) {
    if (valuation) {
      this.studioLabelCheck(valuation.bedrooms);
      if (
        valuation.combinedValuationBooking ||
        valuation.salesValuationBooking
      ) {
        this.setValuationInformations(
          valuation.combinedValuationBooking
            ? valuation.combinedValuationBooking
            : valuation.salesValuationBooking,
          "both"
        );
      } else if (valuation.lettingsValuationBooking) {
        this.setValuationInformations(
          valuation.lettingsValuationBooking,
          "lettings"
        );
      }

      this.salesValuer = { ...this.valuation.salesValuer };
      this.lettingsValuer = { ...this.valuation.lettingsValuer };

      this.adminContact = {
        ...valuation.adminContact,
        isPowerOfAttorney: valuation.isPowerOfAttorney,
        ccOwner: valuation.ccOwner,
      };

      this.valuationForm.patchValue({
        property: valuation.property,
        propertyOwner: valuation.propertyOwner,
        originId: !!this.activeOriginId ? valuation.originId : 0,
        reason: valuation.reason,
        timeFrame: valuation.timeFrame,
        generalNotes: valuation.generalNotes,
        bedrooms: valuation.bedrooms || 0,
        bathrooms: valuation.bathrooms || 0,
        receptions: valuation.receptions || 0,
        tenureId: valuation.tenureId || 0,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(
          valuation.approxLeaseExpiryDate
        ),
        sqFt: this.isEditable
          ? valuation.sqFt || 0
          : valuation.sqFt || "Not Known",
        outsideSpace: this.getInfoDetailValues(
          valuation.outsideSpace,
          this.outsideSpaces
        ),
        parking: this.getInfoDetailValues(valuation.parking, this.parkings),
        propertyFeature: valuation.propertyFeature,
        salesValuer: valuation.salesValuer,
        lettingsValuer: valuation.lettingsValuer,
        type: this.setInitialType(),
        valuationDate: valuation.valuationDate,
        totalHours: valuation.totalHours || 1,
        suggestedAskingPrice: valuation.suggestedAskingPrice
          ? valuation.suggestedAskingPrice
          : "",
        suggestedAskingRentLongLet: valuation.suggestedAskingRentLongLet
          ? valuation.suggestedAskingRentLongLet
          : "",
        suggestedAskingRentLongLetMonthly: valuation.suggestedAskingRentLongLetMonthly
          ? valuation.suggestedAskingRentLongLetMonthly
          : "",
        suggestedAskingRentShortLet: valuation.suggestedAskingRentShortLet
          ? valuation.suggestedAskingRentShortLet
          : "",
        suggestedAskingRentShortLetMonthly: valuation.suggestedAskingRentShortLetMonthly
          ? valuation.suggestedAskingRentShortLetMonthly
          : "",
        instructLet:
          valuation.suggestedAskingRentLongLetMonthly ||
          valuation.suggestedAskingRentShortLet
            ? true
            : false,

        ageOfSuggestedAskingPrice: valuation.valuationDate
          ? this.sharedService.calculateDateToNowInMonths(
              new Date(valuation.valuationDate)
            )
          : 0,
        declarableInterest: valuation.declarableInterest?.toString(),
        section21StatusId: valuation.section21StatusId,
        salesMeetingOwner: this.salesMeetingOwner
          ? this.salesMeetingOwner
          : true,
        lettingsMeetingOwner: this.lettingsMeetingOwner
          ? this.lettingsMeetingOwner
          : true,
        salesOwnerAssociateName: this.salesOwnerAssociateName,
        salesOwnerAssociateContactNumber: this.salesOwnerAssociateContactNumber,
        salesOwnerAssociateEmail: this.salesOwnerAssociateEmail,
        salesOwnerAssociateType: this.salesOwnerAssociateType,
        lettingsOwnerAssociateName: this.lettingsOwnerAssociateName,
        lettingsOwnerAssociateContactNumber: this
          .lettingsOwnerAssociateContactNumber,
        lettingsOwnerAssociateEmail: this.lettingsOwnerAssociateEmail,
        lettingsOwnerAssociateType: this.lettingsOwnerAssociateType,
        propertyStyle: valuation.property?.propertyStyleId,
        propertyType: valuation.property?.propertyTypeId,
        propertyFloor: valuation.property?.propertyFloorId,
        floorOther: valuation.property?.floorOther,
        isRetirementHome: valuation.otherFeatures
          ? valuation.otherFeatures.findIndex(
              (x) => x === OtherFeatures.Retirement_Home
            ) > -1
            ? true
            : false
          : false,
        isNewBuild: valuation.otherFeatures
          ? valuation.otherFeatures.findIndex(
              (x) => x === OtherFeatures.New_Build
            ) > -1
            ? true
            : false
          : false,
        hasDisabledAccess: valuation.propertyFeature
          ? valuation.propertyFeature.findIndex(
              (x) => x === PropertyFeatures.Disabled_Access
            ) > -1
            ? true
            : false
          : false,
      });

      if (!this.isEditable && !this.isNewValuation) {
        this.valuationForm.get("generalNotes").disable();
        this.valuationForm.get("timeFrame").disable();
        this.valuationForm.get("reason").disable();
        this.valuationForm.get("propertyTypeId").disable();
        this.valuationForm.get("propertyFloorId").disable();
        this.valuationForm.get("propertyStyleId").disable();
        this.valuationForm.get("isNewBuild").disable();
        this.valuationForm.get("isRetirementHome").disable();
        this.valuationForm.get("bedrooms").disable();
        this.valuationForm.get("bathrooms").disable();
        this.valuationForm.get("receptions").disable();
        this.valuationForm.get("sqFt").disable();
        this.valuationForm.get("tenureId").disable();
        this.valuationForm.get("approxLeaseExpiryDate").disable();
        this.valuationForm.get("outsideSpace").disable();
        this.valuationForm.get("parking").disable();
        this.valuationForm.get("hasDisabledAccess").disable();
        this.valuationForm.get("salesMeetingOwner").disable();
        this.valuationForm.get("salesOwnerAssociateName").disable();
        this.valuationForm.get("salesOwnerAssociateContactNumber").disable();
        this.valuationForm.get("salesOwnerAssociateEmail").disable();
        this.valuationForm.get("salesOwnerAssociateType").disable();
        this.valuationForm.get("lettingsMeetingOwner").disable();
        this.valuationForm.get("lettingsOwnerAssociateName").disable();
        this.valuationForm.get("lettingsOwnerAssociateContactNumber").disable();
        this.valuationForm.get("lettingsOwnerAssociateEmail").disable();
        this.valuationForm.get("lettingsOwnerAssociateType").disable();
      }
    }
  }

  setInitialType(): string {
    let type = "both";
    if (this.valuation.salesValuer && !this.valuation.lettingsValuer) {
      type = "sales";
    }
    if (this.valuation.lettingsValuer && !this.valuation.salesValuer) {
      type = "lettings";
    }
    return type;
  }

  displayValuationPropInfo(info: ValuationPropertyInfo) {
    if (info) {
      this.valuationForm.patchValue({
        bedrooms: info.bedrooms || 0,
        bathrooms: info.bathrooms || 0,
        receptions: info.receptions || 0,
        tenureId: info.tenureId || 0,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(
          info.approxLeaseExpiryDate
        ),
        sqFt: info.sqFt || 0,
        outsideSpace: this.getInfoDetailValues(
          info.outsideSpace,
          this.outsideSpaces
        ),
        parking: this.getInfoDetailValues(info.parking, this.parkings),
        propertyFeature: info.propertyFeature,
      });
    }
  }

  getInfoDetailValues(propertyInfo: any[], data: InfoDetail[]): InfoDetail[] {
    let infoDetail: InfoDetail[] = [];
    if (propertyInfo && propertyInfo.length > 0 && data) {
      propertyInfo.forEach((value) => {
        infoDetail.push(data.find((info) => info.id == value));
      });
    }
    return infoDetail;
  }

  populateInstructionForm(instruction: Instruction) {
    if (instruction) {
      this.instructionForm.patchValue({
        salesAgencyType: instruction.salesAgencyType,
        lettingsAgencyType: instruction.lettingsAgencyType,
        askingPrice: instruction.askingPrice ? instruction.askingPrice : "",
        askingRentLongLet: instruction.askingRentLongLet
          ? instruction.askingRentLongLet
          : "",
        askingRentLongLetMonthly: instruction.askingRentLongLetMonthly
          ? instruction.askingRentLongLetMonthly
          : "",
        askingRentShortLet: instruction.askingRentShortLet
          ? instruction.askingRentShortLet
          : "",
        askingRentShortLetMonthly: instruction.askingRentShortLetMonthly
          ? instruction.askingRentShortLetMonthly
          : "",
        instructLet:
          instruction.askingRentLongLetMonthly ||
          instruction.askingRentShortLetMonthly
            ? true
            : false,
        instructSale: instruction.askingPrice ? true : false,
        isInstructLongLet: instruction.askingRentLongLetMonthly ? true : false,
        isInstructShortLet: instruction.askingRentShortLet ? true : false,
      });
    }
  }

  setValuationType(val: Valuation) {
    switch (true) {
      case val.salesValuer && !val.lettingsValuer:
        this.isSalesOnly = true;
        this.isSalesAndLettings = false;
        this.isLettingsOnly = false;
        break;

      case val.lettingsValuer && !val.salesValuer:
        this.isLettingsOnly = true;
        this.isSalesOnly = false;
        this.isSalesAndLettings = false;
        break;

      default:
        this.isSalesAndLettings = true;
        this.isLettingsOnly = false;
        this.isSalesOnly = false;
    }
  }

  setOriginTypes(allOriginTypes: InfoDetail[]) {
    this.activeOriginTypes = allOriginTypes.filter(
      (x: InfoDetail) => x.isActive
    );
    // this.isNewValuation ? this.originTypes = this.activeOriginTypes : this.originTypes = allOriginTypes;
  }

  ageColor(value: any): string {
    if (value >= 0) {
      if (value < 4) return "green";
      if (value < 7) return "#CF5E02";
      return "red";
    }
    return null;
  }

  onSelectType(originTypeId: number) {
    this.showOriginId = true;
    const allOrigins = this.allOrigins.filter(
      (x: InfoDetail) => +x.parentId === +originTypeId
    );
    const activeOrigins = this.allOrigins.filter(
      (x: InfoDetail) => +x.parentId === +originTypeId && x.isActive
    );
    // this.isNewValuation ? this.origins = activeOrigins : this.origins = allOrigins;
    this.origins = activeOrigins;
    this.valuationForm.get("originId").setValue(0);
  }

  setOriginIdValue(id: number) {
    if (id) {
      this.allOrigins.forEach((x) => {
        if (+x.id === id && this.isClientService && !this.isEditable) {
          this.origin = x.value;
        }
      });
    }
  }

  setOriginTypeId(originId: number) {
    if (originId) {
      this.allOrigins.forEach((x) => {
        if (+x.id === originId) {
          if (this.activeOriginTypes.find((t) => +t.id === x.parentId)) {
            this.valuationForm.get("originType").setValue(x.parentId);
            this.onSelectType(x.parentId);
            this.valuationForm.get("originId").setValue(originId);
          } else {
            this.addInactiveOriginType(x);
          }
        }
      });
    }
  }

  private addInactiveOriginType(origin: InfoDetail) {
    const originType = this.allOriginTypes.find(
      (t) => +t.id === origin.parentId
    );
    const originId = this.allOrigins.find((o) => +o.id === origin.id);
    if (originType) {
      this.activeOriginTypes.push(originType);
      this.valuationForm.get("originType").setValue(originType.id);
      this.onSelectType(origin.parentId);
      this.valuationForm.get("originId").setValue(origin.id);
      this.origins.push(originId);
    }
  }

  getSelectedProperty(property: Property) {
    if (property) {
      this.showProperty = false;

      this.valuers = [];
      this.property = property;
      this.isPropertyChanged = true;
      this.lastKnownOwner = property.lastKnownOwner;
      this.getContactGroup(this.property?.lastKnownOwner?.contactGroupId).then(
        (result) => {
          this.contactGroup = result;
          this.valuationService.contactGroupBs.next(this.contactGroup);
          this.getSearchedPersonSummaryInfo(this.contactGroup);
        }
      );
      this.valuationForm.get("property").setValue(property);
      this.valuationForm.get("propertyOwner").setValue(this.lastKnownOwner);
      this.getValuers(property.propertyId);
      this.getValuationPropertyInfo(property.propertyId);
      this.getPropertyDetails(property.propertyId);
      this.valuationForm.markAsDirty();
    }
  }

  onClosePropertyFinder() {
    if (!(this.property && this.property.propertyId > 0)) {
      this.router.navigate(["/valuations-register"]);
    } else {
      this.propertySubsription = this.propertyService
        .getValuations(this.property.propertyId, true)
        .pipe(
          map((valuations: Valuation[]) =>
            valuations.map((valuation: Valuation) => {
              return {
                ...valuation,
                valuationStatusDescription:
                  ValuationStatusEnum[valuation.valuationStatus],
              };
            })
          )
        )
        .subscribe((valuations: Valuation[]) => {
          if (valuations && valuations.length > 0) {
            this.activeValuations = valuations.filter(
              (x) =>
                x.valuationStatus == ValuationStatusEnum.Booked ||
                x.valuationStatus == ValuationStatusEnum.None ||
                x.valuationStatus == ValuationStatusEnum.Valued
            );
            this.isActiveValuationsVisible =
              this.activeValuations.length > 0 ? true : false;
          }
        });
    }
  }

  routeToValuationList() {
    this.messageService.add({
      severity: "success",
      summary: "Valuation cancelled",
      closable: false,
    });
    this.valuationService.doValuationSearchBs.next(true);
    this.router.navigate(["/valuations-register"]);
  }

  private getValuationPropertyInfo(propertyId: number) {
    this.valuationService
      .getValuationPropertyInfo(propertyId)
      .subscribe((res) => {
        if (res) {
          if (+res.tenureId === 3 || res.approxLeaseExpiryDate) {
            this.showLeaseExpiryDate = true;
            //this.setApproxLeaseLengthValidator();
          } else {
            this.showLeaseExpiryDate = false;
          }
          this.displayValuationPropInfo(res);
        }
      });
  }

  private getAddedProperty() {
    this.propertyService.newPropertyAdded$
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((newProperty) => {
        if (newProperty) {
          this.property = newProperty;
          this.showProperty = false;
          this.valuationForm.get("property").setValue(this.property);
          this.getValuers(this.property.propertyId);
          // this.getContactGroup(newProperty.lastKnownOwner?.contactGroupId);
          this.getSelectedOwner(newProperty.lastKnownOwner);
        }
      });
  }

  onLettingsValuerChange(valuer: BaseStaffMember) {
    this.lettingsValuer = valuer;
  }

  onSalesValuerChange(valuer: BaseStaffMember) {
    this.salesValuer = valuer;
  }

  getAvailability() {
    this.availableDates = {} as any;
    this.isAppointmentVisible = true;
    this.sideBarControlVisible = true;
    this.isSplitAppointment = false;
    this.thisWeek = [];
    this.nextTwoWeek = [];
    this.nextWeek = [];
    this.oldClass = "null";

    this.availabilityForm.patchValue({
      fromDate: new Date(),
      lettingsValuerId: this.lettingsValuerControl.value
        ? this.lettingsValuerControl.value.staffMemberId
        : "",
      salesValuerId: this.salesValuerControl.value
        ? this.salesValuerControl.value.staffMemberId
        : "",
      type: this.isLettingsEdit
        ? "lettings"
        : this.isSalesEdit
        ? "sales"
        : "both",
    });
  }

  searchAvailability() {
    this.sharedService.logValidationErrors(this.availabilityForm, true);

    if (this.availabilityForm.invalid) {
      return;
    }

    this.isSplitAppointment = false;
    const availability = { ...this.availabilityForm.value };

    const request = {
      fromDate: format(availability.fromDate, "yyyy-MM-dd"),
      salesValuerId:
        (this.isBothEdit || this.isSalesEdit == true) && !this.isLettingsOnly
          ? availability.salesValuerId
          : null,
      lettingsValuerId:
        (this.isBothEdit || this.isLettingsEdit == true) && !this.isSalesOnly
          ? availability.lettingsValuerId
          : null,
    } as ValuersAvailabilityOption;

    if (
      this.isSalesAndLettings &&
      availability.salesValuerId != availability.lettingsValuerId
    ) {
      this.selectedStaffMemberId = availability.salesValuerId;
      this.secondStaffMemberId = availability.lettingsValuerId;
    } else {
      this.selectedStaffMemberId = this.isSalesOnly
        ? availability.salesValuerId
        : availability.lettingsValuerId;
      this.secondStaffMemberId = null;
    }

    this.salesValuerOpenSlots = { thisWeek: [], nextWeek: [], next2Weeks: [] };
    this.lettingsValuerOpenSlots = {
      thisWeek: [],
      nextWeek: [],
      next2Weeks: [],
    };

    this.getAvailableSlots(request);
    this.sideBarControlVisible = false;
  }

  async getAvailableSlots(request) {
    // user chooses both sales and lettings
    let lettingsValuerId;
    let salesValuerId;
    lettingsValuerId = request.lettingsValuerId;
    if (request.salesValuerId) {
      request.lettingsValuerId = null;
      await this.valuationService
        .getValuersAvailability(request)
        .toPromise()
        .then((res) => {
          this.salesValuerOpenSlots = res.valuationStaffMembersCalanderEvents;
          this.availableDates = { ...this.salesValuerOpenSlots };
        });
    }

    request.lettingsValuerId = lettingsValuerId;

    if (request.lettingsValuerId) {
      salesValuerId = request.salesValuerId;
      request.lettingsValuerId = lettingsValuerId;
      request.salesValuerId = null;
      await this.valuationService
        .getValuersAvailability(request)
        .toPromise()
        .then((res) => {
          this.lettingsValuerOpenSlots =
            res.valuationStaffMembersCalanderEvents;
          this.availableDates = { ...this.lettingsValuerOpenSlots };
        });
    }

    request.salesValuerId = salesValuerId;

    if (
      request.salesValuerId &&
      request.lettingsValuerId &&
      request.salesValuerId != request.lettingsValuerId
    ) {
      this.valuationService.getValuersAvailability(request).subscribe((res) => {
        this.availableDates = res.valuationStaffMembersCalanderEvents;
        this.setWeeks();
        let firstAvailableSlot =
          this.thisWeek && this.thisWeek.length > 0
            ? this.thisWeek[0]
            : this.nextWeek[0];
        this.selectedCalendarDate = firstAvailableSlot.date;
        this.showCalendar = true;
        this.selectAvailableDate(firstAvailableSlot.hours[0]);
      });
    } else {
      this.setWeeks();
      let firstAvailableSlot =
        this.thisWeek && this.thisWeek.length > 0
          ? this.thisWeek[0]
          : this.nextWeek[0];
      this.selectedCalendarDate = firstAvailableSlot.date;
      this.showCalendar = true;
      this.selectAvailableDate(firstAvailableSlot.hours[0]);
    }
  }

  setWeeks() {
    this.thisWeek = [];
    this.nextWeek = [];
    this.nextTwoWeek = [];

    if (this.availableDates) {
      this.thisWeek = this.setWeekData(this.availableDates.thisWeek);
      this.nextWeek = this.setWeekData(this.availableDates.nextWeek);
      this.nextTwoWeek = this.setWeekData(this.availableDates.next2Weeks);
    }
  }

  removeSelectedClass(data: any[], oldClass: string) {
    let hourIndex = -1;
    if (data && data.length > 0) {
      for (let i in data) {
        if (
          data[i].hours.findIndex((y) => y.class == "hourColorsForSelected") >
          -1
        ) {
          hourIndex = data[i].hours.findIndex(
            (y) => y.class == "hourColorsForSelected"
          );
          data[i].hours[hourIndex].class = oldClass;
        }
      }
    }
  }

  setWeekData(allData: Date[]): any[] {
    let weekData;
    let hours: any[] = [];
    let newData = [];
    if (allData && allData.length > 0) {
      weekData = this.sharedService.groupByDate(allData);
      console.log(weekData);
      for (let key in weekData) {
        hours = [];
        let defaultHours = [...this.defaultHours];
        let date: Date = new Date(weekData[key][0]);
        if (date.getDay() == 6 || date.getDay() == 0) {
          defaultHours = [...this.defaultHoursForWeekend];
        }
        for (let d in defaultHours) {
          let slotDate = new Date(date.setHours(defaultHours[d]));
          if (date > new Date()) {
            hours.push({
              value: slotDate,
              class:
                this.isLettingsEdit || this.isLettingsOnly
                  ? "hourColorsForLettings"
                  : this.isSalesEdit || this.isSalesOnly
                  ? "hourColorsForSales"
                  : "hourColorsForBoth",
            });
          }
        }

        for (let i = 0; i < hours.length; i++) {
          let index = weekData[key].findIndex(
            (x) => x.getHours() == hours[i].value.getHours()
          );

          if (index > -1) {
            hours[i] = {
              value: hours[i].value,
              class: "",
            };
          } else {
            let lettingIndex = this.findIndexSlot(
              hours[i].value,
              this.lettingsValuerOpenSlots
            );
            let salesIndex = this.findIndexSlot(
              hours[i].value,
              this.salesValuerOpenSlots
            );
            if (lettingIndex == -1 && salesIndex > -1) {
              hours[i] = {
                value: hours[i].value,
                class: "hourColorsForLettings",
              };
            } else if (lettingIndex > -1 && salesIndex == -1) {
              hours[i] = {
                value: hours[i].value,
                class: "hourColorsForSales",
              };
            }
          }
        }

        if (key)
          newData.push({
            date: weekData[key][0],
            hours: [...hours],
          });
      }
    }
    return newData;
  }

  findIndexSlot(
    date: Date,
    slots: ValuationStaffMembersCalanderEvents
  ): number {
    let index = -1;
    if (
      slots.thisWeek &&
      slots.thisWeek.findIndex(
        (x) => new Date(x).getTime() === date.getTime()
      ) > -1
    ) {
      index = slots.thisWeek.findIndex(
        (x) => new Date(x).getTime() === date.getTime()
      );
      return index;
    }
    if (
      slots.nextWeek &&
      slots.nextWeek.findIndex(
        (x) => new Date(x).getTime() === date.getTime()
      ) > -1
    ) {
      index = slots.nextWeek.findIndex(
        (x) => new Date(x).getTime() === date.getTime()
      );
      return index;
    }
    if (
      slots.next2Weeks &&
      slots.next2Weeks.findIndex(
        (x) => new Date(x).getTime() === date.getTime()
      ) > -1
    ) {
      index = slots.next2Weeks.findIndex(
        (x) => new Date(x).getTime() === date.getTime()
      );
      return index;
    }
    return index;
  }

  selectAvailableDate(hours) {
    if (hours) {
      this.selectedDate = hours.value;
      this.selectCalendarDate(this.selectedDate);
      this.isAvailabilityRequired = false;

      this.removeSelectedClass(this.thisWeek, this.oldClass);
      this.removeSelectedClass(this.nextWeek, this.oldClass);
      this.removeSelectedClass(this.nextTwoWeek, this.oldClass);
      this.oldClass = hours.class;
      hours.class = "hourColorsForSelected";
    }
  }

  onPropertyType(value) {
    this.propertyStyles = this.allPropertyStyles?.filter(
      (x: InfoDetail) => +x.parentId === +value
    );

    if (value == PropertyType.House) {
      this.valuationForm.controls["propertyFloorId"].setValue(null);
    }
  }

  setCloseState() {
    this.showCalendar = false;
    this.isAppointmentVisible = false;
    this.sideBarControlVisible = false;
    this.canBookAppointment = false;
    this.isSalesEdit = false;
    this.isLettingsEdit = false;
    this.isBothEdit = false;
    this.oldClass = "null";
  }

  selectCalendarDate(date: Date) {
    this.selectedCalendarDate = date;
    this.showCalendar = true;
  }

  getStaff(members: BaseStaffMember[]) {
    if (members && members.length > 5) {
      return _.take(members, 5);
    }
    return members;
  }

  showValuersList() {
    this.showOnlyMainStaffMember = !this.showOnlyMainStaffMember;
    if (this.property) {
      const propId = this.property.propertyId;
      this.getValuers(propId);
    }
  }

  private getValuers(propId: number) {
    if (this.valuers && !this.valuers.length) {
      this.valuationService
        .getValuers(propId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          this.allValuers = data;
          this.setValuersForSalesAndLettings();
          this.addInactiveValuers();
        });
    }
  }

  // add inactive users for display purposes only.
  addInactiveValuers() {
    const val = this.valuation;
    if (this.allValuers && val) {
      if (
        val.salesValuer &&
        this.allValuers.sales &&
        this.allValuers.sales.length
      ) {
        const index = this.allValuers.sales
          .flatMap((x) => x.staffMembers)
          .findIndex((s) => s.staffMemberId === val.salesValuer?.staffMemberId);
        if (index < 0) {
          this.allValuers.sales[0].staffMembers.push(val.salesValuer);
          this.availabilityForm
            .get("salesValuerId")
            .setValue(val.salesValuer.staffMemberId);
          this.canBookAppointment = false;
        }
      }

      if (
        val.lettingsValuer &&
        this.allValuers.lettings &&
        this.allValuers.lettings.length
      ) {
        const allLettingsValuers = this.allValuers.lettings.flatMap(
          (x) => x.staffMembers
        );
        const index = allLettingsValuers.findIndex(
          (s) => s.staffMemberId === val.lettingsValuer?.staffMemberId
        );
        if (index < 0) {
          this.allValuers.lettings[0].staffMembers.push(val.lettingsValuer);
          this.availabilityForm
            .get("lettingsValuerId")
            .setValue(val.lettingsValuer.staffMemberId);
          this.canBookAppointment = false;
        }
      }
    }
  }

  onTenureChange(tenureId: number) {
    if (+tenureId === 3 || +tenureId === 2) {
      this.showLeaseExpiryDate = true;
    } else {
      this.showLeaseExpiryDate = false;
      // if (this.approxLeaseExpiryDateControl.errors) {
      //   this.approxLeaseExpiryDateControl.clearValidators();
      //   this.approxLeaseExpiryDateControl.updateValueAndValidity();
      // }
    }
  }

  createNewSigner() {
    this.valuationForm.markAsPristine();
  }

  createNewLastKnownOwner() {
    this.isLastknownOwnerVisible = false;
    this.valuationForm.markAsPristine();
  }

  createNewProperty(isNewProperty: boolean) {
    this.valuationForm.markAsPristine();
  }

  showPhotosModal() {
    this.showPhotos = true;
  }

  showMapModal() {
    this.showMap = true;
  }

  hidePhotosModal() {
    this.showPhotos = false;
  }

  changeProperty() {
    this.showProperty = true;
  }

  showPropertyModal() {
    this.showProperty = true;
  }

  toggleAccordion(index: number) {
    this.activeState[index] = !this.activeState[index];
  }

  startInstruction() {
    if (this.valuationForm.controls["declarableInterest"].invalid) {
      this.accordionIndex = 4;
      this.activeState[4] = true;
      this.messageService.add({
        severity: "warn",
        summary: "You must complete terms of business",
        closable: false,
      });
      return;
    }

    let val: Valuation;
    val = { ...this.valuation, ...this.valuationForm.value };

    const instruction = {
      valuationEventId: val.valuationEventId,
      salesAgencyType: "",
      lettingsAgencyType: "",
      askingPrice: val.suggestedAskingPrice,
      askingRentShortLet: val.suggestedAskingRentShortLet,
      askingRentLongLet: val.suggestedAskingRentLongLet,
      askingRentShortLetMonthly: val.suggestedAskingRentShortLetMonthly,
      askingRentLongLetMonthly: val.suggestedAskingRentLongLetMonthly,
    } as Instruction;
    this.instruction = instruction;
    this.isInstructVisible = true;
    this.populateInstructionForm(instruction);
    this.setInstructionFlags(instruction);
  }

  setInstructionFlags(instruction: Instruction) {
    if (instruction.askingPrice && !instruction.askingRentLongLet) {
      this.instructionForm.get("instructSale").setValue(true);
      this.showInstruct = false;
    } else if (!instruction.askingPrice && instruction.askingRentLongLet) {
      this.instructionForm.get("instructLet").setValue(true);
      this.showInstruct = false;
    } else {
      this.showInstruct = true;
    }
  }

  onInstructLettingsChange(event) {
    if (this.instructionForm.get("instructLet").value == false) {
      this.formErrors.lettingsAgencyType = null;
      this.instructionForm.patchValue(
        {
          isInstructLongLet: false,
          isInstructShortLet: false,
        },
        { emitEvent: false }
      );
    }
  }

  setInstructionFormValidators() {
    this.setAskingPriceValidator();
    this.setRentValidators();
  }

  setAgencyTypeValidator() {
    if (this.instructSaleControl.value) {
      this.setSalesAgencyTypeValidator();
    }
    if (this.instructLetControl.value) {
      this.setLettingsAgencyTypeValidator();
    }
  }

  setValuersValidators() {
    this.setSalesValuerValidator();
    this.setLettingsValuerValidator();
  }

  setLettingsValuerValidator() {
    if (
      (this.isLettingsOnly || this.isSalesAndLettings) &&
      !this.lettingsValuerIdControl.value
    ) {
      this.lettingsValuerIdControl.setValidators(Validators.required);
      this.lettingsValuerIdControl.updateValueAndValidity();
    } else {
      this.lettingsValuerIdControl.clearValidators();
      this.lettingsValuerIdControl.updateValueAndValidity();
    }
  }

  private setSalesValuerValidator() {
    if (
      (this.isSalesOnly || this.isSalesAndLettings) &&
      !this.salesValuerIdControl.value
    ) {
      this.salesValuerIdControl.setValidators(Validators.required);
      this.salesValuerIdControl.updateValueAndValidity();
    } else {
      this.salesValuerIdControl.clearValidators();
      this.salesValuerIdControl.updateValueAndValidity();
    }
  }

  private setAskingPriceValidator() {
    if (
      this.instructionForm.get("instructSale").value &&
      !this.instAskingPriceControl.value
    ) {
      this.instAskingPriceControl.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.instAskingPriceControl.updateValueAndValidity();
    } else {
      this.instAskingPriceControl.clearValidators();
      this.instAskingPriceControl.updateValueAndValidity();
    }
  }

  private setLongLetRentValidator() {
    if (
      !this.instLongLetWeeklyControl.value &&
      !this.instShortLetWeeklyControl.value
    ) {
      this.instLongLetWeeklyControl.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.instLongLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instLongLetWeeklyControl.clearValidators();
      this.instLongLetWeeklyControl.updateValueAndValidity();
    }
  }

  private setShortLetRentValidator() {
    if (
      !this.instShortLetWeeklyControl.value &&
      !this.longLetWeeklyControl.value
    ) {
      this.instShortLetWeeklyControl.setValidators(Validators.required);
      this.instShortLetWeeklyControl.updateValueAndValidity();
    } else {
      this.instShortLetWeeklyControl.clearValidators();
      this.instShortLetWeeklyControl.updateValueAndValidity();
    }
  }

  setRentValidators() {
    if (this.instructionForm.get("instructLet").value) {
      switch (true) {
        case !this.instLongLetWeeklyControl.value:
          this.setLongLetRentValidator();
          break;
        case !this.shortLetWeeklyControl.value:
          this.setShortLetRentValidator();
          break;
      }
    }
  }

  private setSalesAgencyTypeValidator() {
    const salesAgencyControl = this.instructionForm.get("salesAgencyType");

    if (this.instructSaleControl) {
      salesAgencyControl.setValidators(Validators.required);
      salesAgencyControl.updateValueAndValidity();
    } else {
      salesAgencyControl.clearValidators();
      salesAgencyControl.updateValueAndValidity();
    }
  }

  private setLettingsAgencyTypeValidator() {
    const lettingsAgencyControl = this.instructionForm.get(
      "lettingsAgencyType"
    );

    if (this.instructLetControl) {
      lettingsAgencyControl.setValidators(Validators.required);
      lettingsAgencyControl.updateValueAndValidity();
    } else {
      lettingsAgencyControl.clearValidators();
      lettingsAgencyControl.updateValueAndValidity();
    }
  }

  private setOriginTypeValidator() {
    if (this.originTypeControl) {
      this.originTypeControl.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.originTypeControl.updateValueAndValidity();
    } else {
      this.originTypeControl.clearValidators();
      this.originTypeControl.updateValueAndValidity();
    }
  }

  private setOriginIdValidator() {
    if (this.originIdControl) {
      this.originIdControl.setValidators([
        Validators.required,
        Validators.min(1),
      ]);
      this.originIdControl.updateValueAndValidity();
    } else {
      this.originIdControl.clearValidators();
      this.originIdControl.updateValueAndValidity();
    }
  }

  saveInstruction() {
    this.setAgencyTypeValidator();
    this.setInstructionFormValidators();

    this.sharedService.logValidationErrors(this.instructionForm, true);
    const instructionSelected =
      this.instructionForm.get("instructSale").value ||
      this.instructionForm.get("instructLet").value;
    if (this.instructionForm.valid) {
      if (this.instructionForm.dirty && instructionSelected) {
        this.isSubmitting = true;
        const instruction = {
          ...this.instruction,
          ...this.instructionForm.value,
        } as Instruction;
        this.setInstructionValue(instruction);
        this.valuationService.addInstruction(instruction).subscribe(
          (result: ResultData) => {
            this.onInstructionSaveComplete(result.status);
          },
          (error: WedgeError) => {
            this.isSubmitting = false;
          }
        );
      } else {
        this.onInstructionSaveComplete();
      }
    } else {
      Object.keys(this.instructionForm.controls).forEach((key: string) => {
        const control = this.instructionForm.get(key);
        if (control.invalid)
          this.messageService.add({
            severity: "warn",
            summary: "You must enter " + key + " value",
            closable: false,
          });
      });
    }
  }

  setInstructionValue(instruction: Instruction) {
    const isSale = this.instructionForm.get("instructSale").value;
    const isLet = this.instructionForm.get("instructLet").value;
    instruction.askingPrice = 0;
    instruction.askingRentShortLet = 0;
    instruction.askingRentLongLet = 0;
    instruction.askingRentShortLetMonthly = 0;
    instruction.askingRentLongLetMonthly = 0;

    if (isSale) {
      instruction.askingPrice = this.sharedService.convertStringToNumber(
        this.instAskingPriceControl.value
      );
    }
    if (isLet) {
      instruction.askingRentLongLet = this.sharedService.convertStringToNumber(
        this.instLongLetWeeklyControl.value
      );
      instruction.askingRentLongLetMonthly = this.sharedService.convertStringToNumber(
        this.instLongLetMonthlyControl.value
      );
      instruction.askingRentShortLet = this.sharedService.convertStringToNumber(
        this.instShortLetWeeklyControl.value
      );
      instruction.askingRentShortLetMonthly = this.sharedService.convertStringToNumber(
        this.instShortLetMonthlyControl.value
      );
    }
  }

  checkAvailabilityBooking() {
    if (
      (this.isNewValuation || this.isEditable) &&
      !this.valuationForm.get("valuationDate").value
    ) {
      if (
        this.isSalesAndLettings &&
        !this.valuation?.lettingsValuationBooking?.startDateTime &&
        !this.valuation?.salesValuationBooking?.startDateTime
      ) {
        this.isAvailabilityRequired = true;
      }
      if (
        this.isSalesOnly &&
        !this.valuation?.salesValuationBooking?.startDateTime
      ) {
        this.isAvailabilityRequired = true;
        this.isSalesAndLettings = false;
        this.isLettingsOnly = false;
      }
      if (
        this.isLettingsOnly &&
        !this.valuation?.lettingsValuationBooking?.startDateTime
      ) {
        this.isAvailabilityRequired = true;
        this.isSalesOnly = false;
        this.isSalesAndLettings = false;
      }
    }
  }

  saveValuation() {
    this.checkAvailabilityBooking();
    this.setValuersValidators();
    this.sharedService.logValidationErrors(this.valuationForm, true);

    // validation of land register
    //this.valuationService.valuationValidationSubject.next(true);

    if (this.formErrors["declarableInterest"]) {
      this.accordionIndex = 4;
      this.activeState[4] = true;
      this.messageService.add({
        severity: "warn",
        summary: "You must complete terms of business",
        closable: false,
      });
      return;
    }

    if (this.isAvailabilityRequired) {
      this.messageService.add({
        severity: "warn",
        summary: "You must make valuation appointments",
        closable: false,
      });
      return;
    }
    //this.valuationService.validationControlBs.getValue()
    if (this.valuationForm.valid) {
      this.addOrUpdateValuation();
      // if (
      //   this.valuationForm.dirty ||
      //   this.isOwnerChanged ||
      //   this.isPropertyChanged ||
      //   this.isAdminContactChanged
      // ) {
      //   this.addOrUpdateValuation();
      // } else {
      //   this.onSaveComplete();
      // }
    } else {
      this.errorMessage = {} as WedgeError;
      this.errorMessage.displayMessage = "Please correct validation errors";
    }
  }

  getInfoIdArray(infoArray: InfoDetail[]): number[] {
    let idArray: number[] = [];
    if (infoArray && infoArray.length > 0) {
      infoArray.map((element) => {
        idArray.push(element.id);
        return idArray;
      });
    }
    return idArray;
  }

  addOrUpdateValuation() {
    this.setLeaseExpiryDate();
    this.isSubmitting = true;
    const valuation = { ...this.valuation, ...this.valuationForm.value };
    valuation.propertyOwner = this.lastKnownOwner;
    valuation.OfficeId = this.property.officeId;

    valuation.isPowerOfAttorney =
      this.adminContact && this.adminContact.contactGroupId > 0
        ? this.adminContact?.isPowerOfAttorney
        : false;
    valuation.ccOwner =
      this.adminContact && this.adminContact.contactGroupId > 0
        ? this.adminContact?.ccOwner
        : false;

    valuation.suggestedAskingRentShortLetMonthly = this.sharedService.convertStringToNumber(
      valuation.suggestedAskingRentShortLetMonthly
    );
    valuation.property.propertyTypeId = valuation.propertyTypeId;
    valuation.property.propertyStyleId = valuation.propertyStyleId;
    valuation.property.propertyFloorId = valuation.propertyFloorId;
    valuation.property.floorOther = valuation.floorOther;
    valuation.otherFeatures = [];
    valuation.propertyFeature = [];

    if (this.showLeaseExpiryDate) {
      valuation.leaseLandReg = {};
    }

    if (valuation.isNewBuild)
      valuation.otherFeatures.push(OtherFeatures.New_Build);
    if (valuation.isRetirementHome)
      valuation.otherFeatures.push(OtherFeatures.Retirement_Home);
    if (valuation.hasDisabledAccess)
      valuation.propertyFeature.push(PropertyFeatures.Disabled_Access);

    valuation.suggestedAskingRentLongLetMonthly = this.sharedService.convertStringToNumber(
      valuation.suggestedAskingRentLongLetMonthly
    );
    valuation.suggestedAskingPrice = this.sharedService.convertStringToNumber(
      valuation.suggestedAskingPrice
    );
    valuation.suggestedAskingRentShortLet = this.sharedService.convertStringToNumber(
      valuation.suggestedAskingRentShortLet
    );
    valuation.suggestedAskingRentLongLet = this.sharedService.convertStringToNumber(
      valuation.suggestedAskingRentLongLet
    );

    this.checkValuers(valuation);
    if (this.approxLeaseExpiryDate) {
      valuation.approxLeaseExpiryDate = this.approxLeaseExpiryDate;
    }
    if (this.valuationForm.get("sqFt").value === "Not Known") {
      valuation.sqFt = 0;
    }

    valuation.parking = this.getInfoIdArray(
      this.valuationForm.get("parking").value
    );
    valuation.outsideSpace = this.getInfoIdArray(
      this.valuationForm.get("outsideSpace").value
    );

    this.setValuers(valuation);

    if (this.isNewValuation) {
      this.valuationService.addValuation(valuation).subscribe(
        (data) => {
          if (data) {
            this.onSaveComplete(data);
          }
        },
        (error: WedgeError) => {
          this.messageService.add({
            severity: "error",
            summary: error.displayMessage,
            closable: false,
          });
          this.isSubmitting = false;
        }
      );
    } else {
      this.valuationService.updateValuation(valuation).subscribe(
        (data) => {
          if (data) {
            this.onSaveComplete(data);
          }
        },
        (error: WedgeError) => {
          this.errorMessage = error;
          this.isSubmitting = false;
        }
      );
    }
  }

  setValuers(valuation) {
    if (
      valuation.salesValuationBooking?.startDateTime ==
      valuation.lettingsValuationBooking?.startDateTime
    ) {
      valuation.combinedValuationBooking = {
        name:
          valuation.salesMeetingOwner == false
            ? valuation.salesOwnerAssociateName
            : "",
        emailAddress:
          valuation.salesMeetingOwner == false
            ? valuation.salesOwnerAssociateEmail
            : "",
        contactNumber:
          valuation.salesMeetingOwner == false
            ? valuation.salesOwnerAssociateContactNumber
            : "",
        associationId:
          valuation.salesMeetingOwner == false
            ? valuation.salesOwnerAssociateType
            : "",
        meetingOwner: valuation.salesMeetingOwner,
        startDateTime: valuation.salesValuationBooking?.startDateTime,
        totalHours: 1,
      };
      valuation.combinedValuationBooking.meetingOwner =
        valuation.salesMeetingOwner == false ? false : true;
    } else {
      valuation.combinedValuationBooking = null;
      if (valuation.salesValuationBooking) {
        valuation.salesValuationBooking = {
          name:
            valuation.salesMeetingOwner == false
              ? valuation.salesOwnerAssociateName
              : "",
          emailAddress:
            valuation.salesMeetingOwner == false
              ? valuation.salesOwnerAssociateEmail
              : "",
          contactNumber:
            valuation.salesMeetingOwner == false
              ? valuation.salesOwnerAssociateContactNumber
              : "",
          associationId:
            valuation.salesMeetingOwner == false
              ? valuation.salesOwnerAssociateType
              : "",
          meetingOwner: valuation.salesMeetingOwner,
          startDateTime: valuation.salesValuationBooking?.startDateTime,
          totalHours: 1,
        };
        valuation.salesValuationBooking.meetingOwner =
          valuation.salesMeetingOwner == false ? false : true;
      }
      if (valuation.lettingsValuationBooking) {
        valuation.lettingsValuationBooking = {
          name:
            valuation.lettingMeetingOwner == false
              ? valuation.lettingsOwnerAssociateName
              : "",
          emailAddress:
            valuation.lettingMeetingOwner == false
              ? valuation.lettingsOwnerAssociateEmail
              : "",
          contactNumber:
            valuation.lettingMeetingOwner == false
              ? valuation.lettingsOwnerAssociateContactNumber
              : "",
          associationId:
            valuation.lettingMeetingOwner == false
              ? valuation.lettingsOwnerAssociateType
              : "",
          meetingOwner: valuation.lettingMeetingOwner,
          startDateTime: valuation.lettingsValuationBooking?.startDateTime,
          totalHours: 1,
        };
        valuation.lettingsValuationBooking.meetingOwner =
          valuation.lettingMeetingOwner == false ? false : true;
      }
    }
  }

  checkValuers(valuation: any) {
    switch (valuation.type) {
      case "lettings":
        valuation.salesValuer = null;
        break;
      case "sales":
        valuation.lettingsValuer = null;
        break;
    }
  }

  private setLeaseExpiryDate() {
    if (this.valuationForm.get("approxLeaseExpiryDate").value) {
      const leaseExpiryDateInYears = +this.valuationForm.get(
        "approxLeaseExpiryDate"
      ).value;
      this.approxLeaseExpiryDate = addYears(new Date(), leaseExpiryDateInYears);
    }
  }

  private changeLeaseExpiryDateToYears(approxLeaseExpiryDate: any) {
    if (approxLeaseExpiryDate) {
      return differenceInCalendarYears(
        new Date(approxLeaseExpiryDate),
        new Date()
      );
    }
  }

  duplicateValuation() {
    const propertyId = this.property.propertyId;
    const lastKnownOwnerId = this.lastKnownOwner.contactGroupId;
    this.router.navigateByUrl("/", { skipLocationChange: true }).then(() =>
      this.router.navigate(["valuations-register/detail/", 0, "edit"], {
        queryParams: {
          propertyId: propertyId,
          lastKnownOwnerId: lastKnownOwnerId,
          isNewValuation: true,
        },
      })
    );
  }

  onSaveComplete(valuation?: Valuation) {
    this.valuationForm.markAsPristine();
    this.isSubmitting = false;
    this.errorMessage = null;
    if (this.isNewValuation) {
      // this.toastr.success('Valuation successfully saved');
      this.messageService.add({
        severity: "success",
        summary: "Valuation successfully saved",
        closable: false,
      });
      this.sharedService.resetUrl(this.valuationId, valuation.valuationEventId);
    } else {
      // this.toastr.success('Valuation successfully updated');
      this.messageService.add({
        severity: "success",
        summary: "Valuation successfully updated",
        closable: false,
      });
    }

    if (valuation && valuation.valuationEventId > 0)
      this.router
        .navigateByUrl("/", { skipLocationChange: true })
        .then(() =>
          this.router.navigate([
            "/valuations-register/detail",
            valuation.valuationEventId,
            "edit",
          ])
        );
  }

  onInstructionSaveComplete(status?: boolean) {
    // const instructionEventId = instruction.salesInstructionEventId || instruction.lettingsInstructionEventId;
    this.instructionForm.markAsPristine();
    this.isSubmitting = false;
    this.errorMessage = null;
    if (status) {
      this.messageService.add({
        severity: "success",
        summary: "Instruction successfully saved",
        closable: false,
      });
      this.router.navigate([
        "/property-centre/detail",
        this.property.propertyId,
      ]);
    }
  }

  cancel() {
    this.sharedService.back();
  }

  cancelInstruction() {
    this.sharedService.resetForm(this.instructionForm);
  }

  cancelBooking() {
    this.sharedService.resetForm(this.availabilityForm);
    this.isAppointmentVisible = false;
  }

  makeBooking() {
    if (this.isSplitAppointment == true) {
      if (!this.selectedSalesDate) {
        this.bookingButtonLabel = "Book For Lettings";
        this.selectedSalesDate = this.selectedDate;
        return;
      } else {
        this.selectedLettingsDate = this.selectedDate;
      }
    } else {
      this.selectedLettingsDate = this.selectedDate;
      this.selectedSalesDate = this.selectedDate;
    }

    this.oldClass = "null";

    if (this.valuation && !this.valuation.valuationDate) {
      this.valuation.valuationDate = this.selectedSalesDate;
    }
    this.valuationForm.controls["valuationDate"].setValue(
      this.selectedSalesDate
    );
    if (this.salesValuer && (this.isSalesOnly || this.isSalesAndLettings)) {
      this.salesValuerControl.setValue(this.salesValuer);
      this.salesValuerControl.updateValueAndValidity();
      this.valuation.salesValuationBooking = {
        startDateTime: this.selectedSalesDate,
        totalHours: 1,
      };
      this.getTimeSalesValuationDate = this.selectedSalesDate?.getTime();
    }
    if (
      this.lettingsValuer &&
      (this.isLettingsOnly || this.isSalesAndLettings)
    ) {
      this.lettingsValuerControl.setValue(this.lettingsValuer);
      this.lettingsValuerControl.updateValueAndValidity();
      this.valuation.lettingsValuationBooking = {
        startDateTime: this.selectedLettingsDate,
        totalHours: 1,
      };
      this.getTimeLettingsValuationDate = this.selectedLettingsDate?.getTime();
    }

    if (this.isBothEdit) {
      if (this.isSalesOnly) {
        {
          this.lettingsValuerControl.setValue(null);
          this.valuation.lettingsValuationBooking = null;
          this.getTimeLettingsValuationDate = null;
        }
      } else if (this.isLettingsOnly) {
        this.salesValuerControl.setValue(null);
        this.valuation.salesValuationBooking = null;
        this.getTimeSalesValuationDate = null;
      }
    }

    this.setCloseState();

    this.valuationForm.markAsDirty();
  }

  canDeactivate(): boolean {
    if (
      !this.isCanDeactivate &&
      this.valuationForm.dirty &&
      !this.isSubmitting
    ) {
      return false;
    }
    return true;
  }

  ngOnDestroy() {
    this.property = {} as Property;
    this.propertyService.setAddedProperty(null);
    this.sharedService.clearFormValidators(this.valuationForm, this.formErrors);
    this.storage.delete("valuationFormData").subscribe();
    this.openContactGroupSubscription.unsubscribe();
    this.propertySubsription.unsubscribe();
    this.contactGroupSubscription.unsubscribe();
    this.storage.delete(this.mainPersonId?.toString()).subscribe();
    this.destroy.unsubscribe();
  }
}
