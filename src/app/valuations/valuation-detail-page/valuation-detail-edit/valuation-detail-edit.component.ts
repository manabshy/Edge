import { ValuationCancellationReasons, ValuationTypeEnum } from '../../shared/valuation'
import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core'
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { StorageMap } from '@ngx-pwa/local-storage'
import { debounceTime, takeUntil, distinctUntilChanged, map } from 'rxjs/operators'
import { ContactGroup, ContactNote, PersonSummaryFigures, Signer } from 'src/app/contact-groups/shared/contact-group.interfaces'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service'
import { SharedService, WedgeError } from 'src/app/core/services/shared.service'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { FormErrors } from 'src/app/core/shared/app-constants'
import { MinBedrooms, OtherFeatures, Property, PropertyFeatures, PropertyType } from 'src/app/property/shared/property'
import { PropertyService } from 'src/app/property/shared/property.service'
import { BaseComponent } from 'src/app/shared/models/base-component'
import { BaseProperty } from 'src/app/shared/models/base-property'
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member'
import {
  Valuation,
  ValuationStatusEnum,
  ValuationPropertyInfo,
  Valuer,
  OfficeMember,
  ValuersAvailabilityOption,
  ValuationStaffMembersCalanderEvents,
  ValuationBooking
} from '../../shared/valuation'
import { Instruction } from 'src/app/shared/models/instruction'
import { ResultData } from 'src/app/shared/result-data'
import { StaffMember } from 'src/app/shared/models/staff-member'
import format from 'date-fns/format'
import { BehaviorSubject, of, Subject, Subscription } from 'rxjs'
import { MenuItem, MessageService, PrimeNGConfig } from 'primeng/api'
import { addYears, differenceInCalendarYears } from 'date-fns'
import _ from 'lodash'
import { SideNavItem, SidenavService } from 'src/app/core/services/sidenav.service'
import { Person } from 'src/app/shared/models/person'
import moment from 'moment'
import { eSignTypes } from 'src/app/core/shared/eSignTypes'
import { ValuationFacadeService } from '../../shared/valuation-facade.service'
import { enumDepartments } from 'src/app/core/shared/departments'
// import { ValuationDetailStore } from './valuation-detail-store'

@Component({
  selector: 'app-valuation-detail-edit',
  templateUrl: './valuation-detail-edit.component.html',
  styleUrls: ['./valuation-detail-edit.component.scss']
  // providers: [ValuationDetailStore] // TODO switch to this store once implemented state clean up!
})
export class ValuationDetailEditComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
  showCalendar = false
  valuationId: number
  valuation: Valuation
  lastKnownOwner: Signer
  adminContact: Signer | null
  valuationForm: FormGroup
  tenures: InfoDetail[]
  outsideSpaces: InfoDetail[]
  parkings: InfoDetail[]
  features: InfoDetail[]
  selectedDate: Date
  selectedSalesDate: Date
  selectedLettingsDate: Date
  createdSigner: any
  isCreatingNewSigner: boolean
  allStaffMembers: BaseStaffMember[] = []
  mainStaffMember: BaseStaffMember
  staffMemberId: number
  isNewValuation: boolean = false
  showOnlyMainStaffMember: boolean
  errorMessage: WedgeError
  isSubmitting: boolean
  formErrors = FormErrors
  property: Property
  isOwnerChanged: boolean
  isAdminContactChanged: boolean = false
  isPropertyChanged: boolean
  isEditable: boolean = false
  showLeaseExpiryDate: boolean
  canInstruct: boolean
  canSaveValuation: boolean = true
  propertyId: number
  lastKnownOwnerId: number
  originId: number
  leadTypeId: number
  approxLeaseExpiryDate: Date
  instructionForm: FormGroup
  instruction: Instruction
  originTypes: InfoDetail[] = []
  allOrigins: InfoDetail[] = []
  valuers: Valuer[] = []
  lettingsValuers: OfficeMember[] = []
  salesValuers: OfficeMember[] = []
  allValuers: Valuer
  showDateAndDuration: boolean
  hasDateWithValuer = false
  allOriginTypes: InfoDetail[] = []
  associateTypes: InfoDetail[] = []
  isSelectingDate = false
  showInstruct: boolean
  currentStaffMember: StaffMember
  isClientService: boolean
  activeOriginTypes: InfoDetail[] = []
  salesValuerLabel: string
  lettingsValuerLabel: string
  isSalesAndLettings: boolean
  isSalesOnly: boolean
  isLettingsOnly: boolean
  isSales: boolean
  isLettings: boolean
  selectedValuerIdList = []
  selectedValuerId: number
  availabilityForm: FormGroup
  canBookAppointment = true
  isAvailabilityRequired = false
  oldClass: string = 'null'
  contactGroup: ContactGroup
  adminContactGroup: ContactGroup
  contactGroupSubscription = new Subscription()
  showPhotos = false
  showMap = false
  showProperty = false
  isLastKnownOwnerVisible = false
  isAdminContactVisible = false
  isInstructVisible = false
  accordionIndex: number
  propertySubscription = new Subscription()
  isRelet = false
  salesMeetingOwner
  lettingsMeetingOwner
  salesOwnerAssociateName
  salesOwnerAssociateContactNumber
  salesOwnerAssociateEmail
  salesOwnerAssociateType
  lettingsOwnerAssociateName
  lettingsOwnerAssociateContactNumber
  lettingsOwnerAssociateEmail
  lettingsOwnerAssociateType
  isAppointmentVisible = false
  lettingsValuerOpenSlots: ValuationStaffMembersCalanderEvents
  salesValuerOpenSlots: ValuationStaffMembersCalanderEvents
  isFromProperty = false
  thisWeek: any[] = []
  nextWeek: any[] = []
  nextTwoWeek: any[] = []
  warningForValuer = true
  sideBarControlVisible = false
  selectedCalendarDate: Date = null
  viewingArrangements: InfoDetail[]
  secondStaffMemberId: number
  selectedStaffMemberId: number = 0
  isSalesEdit = false
  isLettingsEdit = false
  isBothEdit = true
  isSplitAppointment = false
  getTimeSalesValuationDate: number
  getTimeLettingsValuationDate: number
  todaysDate = new Date()
  defaultHours = ['12:45', '13', '16', '17', '18', '19']
  defaultHoursForWeekend = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  lettingsValuer: BaseStaffMember
  salesValuer: BaseStaffMember
  bookingButtonLabel = 'Book For Sales and Lettings'
  propertyTypes: InfoDetail[]
  propertyStyles: InfoDetail[]
  propertyFloors: InfoDetail[]
  allPropertyStyles: InfoDetail[]
  activeValuations: Valuation[] = []
  isActiveValuationsVisible = false
  isCanDeactivate = false
  openContactGroupSubscription = new Subscription()
  cancelValuationSubscription = new Subscription()
  removeContactGroupSubscription = new Subscription()
  eSignSubscription = new Subscription()
  moreInfo = (this.sidenavService.selectedItem = 'valuationTicket')
  summaryTotals: PersonSummaryFigures
  sideNavItems: SideNavItem[]
  contactId: number
  mainPersonId: number
  showOnlyMyNotes: boolean = false
  contactNotes: ContactNote[] = []
  page = 0
  pageSize = 20
  bottomReached = false
  isNoteSelected = false
  person: Person
  destroy = new Subject()
  showStudioLabel = false
  isCancelValuationVisible = false
  isCancelled = false
  isPropertyInfoDisabled = false
  cancelString: string = ''
  cancelReasonString: string = ''
  saveValuationSubscription = new Subscription()
  changedLastOwner: Signer
  isAllowedForValueChanges: boolean = false
  isStillInOneMonthPeriod: boolean = false
  isValuationMeetingNotesVisible = true
  isAllowedForValueChangesSubscription = new Subscription()
  isEditValueActive = false
  hasLiveInstruct = false
  liveInstructWarning = false
  liveInstructHeader = 'Error'
  instructionTypeMessage: string
  baseCalendarClass: string = 'lettingsEvent'
  isValuationNotesVisible = true
  isDisabledInstructButton = false
  valueMenuItems: MenuItem[] = [
    {
      id: 'editValue',
      label: 'Edit',
      icon: 'pi pi-pencil',
      command: () => {
        this.isEditValueActive = true
      }
    }
  ]
  contactGroupLoading: boolean = true

  // previousContactGroupId: number;
  get dataNote() {
    if (this.contactGroup?.contactGroupId) {
      return {
        contactGroupId: this.contactGroup.contactGroupId,
        people: this.contactGroup.contactPeople,
        notes: this.contactNotes
      }
    }
    if (this.contactGroup) {
      return { contactGroupId: this.contactGroup, notes: this.contactNotes }
    }
    return null
  }

  get valuationTypeControl() {
    return this.availabilityForm.get('type') as FormControl
  }

  get salesValuerIdControl() {
    return this.availabilityForm.get('salesValuerId') as FormControl
  }
  get lettingsValuerIdControl() {
    return this.availabilityForm.get('lettingsValuerId') as FormControl
  }
  get salesValuerControl() {
    return this.valuationForm.get('salesValuer') as FormControl
  }
  get lettingsValuerControl() {
    return this.valuationForm.get('lettingsValuer') as FormControl
  }

  get isInvitationSent() {
    return this.valuationForm.get('isInvitationSent') as FormControl
  }

  get approxLeaseExpiryDateControl() {
    return this.valuationForm.get('approxLeaseExpiryDate') as FormControl
  }
  get shortLetWeeklyControl() {
    return this.valuationForm.get('suggestedAskingRentShortLet') as FormControl
  }
  get longLetWeeklyControl() {
    return this.valuationForm.get('suggestedAskingRentLongLet') as FormControl
  }
  get shortLetMonthlyControl() {
    return this.valuationForm.get('suggestedAskingRentShortLetMonthly') as FormControl
  }
  get longLetMonthlyControl() {
    return this.valuationForm.get('suggestedAskingRentLongLetMonthly') as FormControl
  }

  get suggestedAskingPrice() {
    return this.valuationForm.get('suggestedAskingPrice') as FormControl
  }

  get instAskingPriceControl() {
    return this.instructionForm.get('askingPrice') as FormControl
  }
  get instShortLetWeeklyControl() {
    return this.instructionForm.get('askingRentShortLet') as FormControl
  }
  get instLongLetWeeklyControl() {
    return this.instructionForm.get('askingRentLongLet') as FormControl
  }
  get instShortLetMonthlyControl() {
    return this.instructionForm.get('askingRentShortLetMonthly') as FormControl
  }
  get instLongLetMonthlyControl() {
    return this.instructionForm.get('askingRentLongLetMonthly') as FormControl
  }
  get instructSaleControl() {
    return this.instructionForm.get('instructSale') as FormControl
  }
  get instructLetControl() {
    return this.instructionForm.get('instructLet') as FormControl
  }

  get rooms() {
    return MinBedrooms
  }

  get areValuesVisible() {
    if (this.valuation) {
      // TODO might be a bug here as throws undefined on test after adding new contact
      return this.valuation.valuationStatus !== ValuationStatusEnum.None
    }
  }

  get isLandRegisterVisible() {
    if (this.valuation) {
      return !(
        this.valuation.valuationStatus === ValuationStatusEnum.None ||
        this.valuation.valuationStatus === ValuationStatusEnum.Booked
      )
    }
  }

  activeState: boolean[] = [true, true, true, true, true, true, true]

  statuses = [
    { name: 'valuationNotes', value: 0, isValid: false, isNext: false },
    { name: 'propertyInfo', value: 1, isValid: false, isNext: false },
    { name: 'appointment', value: 2, isValid: false, isNext: false },
    { name: 'values', value: 3, isValid: false, isNext: false },
    { name: 'termsOfBusiness', value: 4, isValid: false, isNext: false },
    { name: 'landRegistry', value: 6, isValid: false, isNext: false },
    { name: 'complianceChecks', value: 9, isValid: false, isNext: false }
  ]

  setRequirementValuationNoteBs = new BehaviorSubject(false)

  interestList: any[] = []

  valuationData$ = this._valuationFacadeSvc.valuationData$ // Observable of valuation data from service. Used by Terms of Business component. GOAL: replace this.valution this this observable

  constructor(
    private _valuationFacadeSvc: ValuationFacadeService,
    private propertyService: PropertyService,
    private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService,
    private messageService: MessageService,
    private storage: StorageMap,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private primengConfig: PrimeNGConfig,
    private sidenavService: SidenavService // private store: ValuationDetailStore // TODO migrate state to NGRX component store for valuation data
  ) {
    super()
  }

  ngOnInit() {
    console.log('valuation detail edit component inniting')

    // builds forms, reacts to data changes from all over the shop
    this.setViewLevelPropsAndSubscriptions()

    // creates new or loads existing valuation. The meat and potatos!
    this.addValuationDataToView()
  }

  /***
   * functions used by OnInit 👷
   */
  private setViewLevelPropsAndSubscriptions() {
    // random props and bs next
    this.miscellaneousConfig()

    // valuationId, propertyId,
    this.setViewLevelPropsFromRouteParams()

    // sets up forms used in the view (valuation, appointment, instruction)
    this.setupForms()

    // subscribes to a bunch of different streams
    this.subscribeToStreams()

    // more calendar stuff for appointment bookings
    this.toggleValuerType()

    // sets some props and builds sidenav items
    this.buildSideNav()
  }

  private miscellaneousConfig() {
    this._valuationFacadeSvc.landRegisterValid.next(false)
    this.primengConfig.ripple = true
  }

  private subscribeToStreams() {
    // info dropdown options and currentUser assignment
    this.subscribeToStorageStreams()

    // subscribes to newPropertyAdded$ in property service and sets property to that value (if/when ones exists)
    this.subscribeToNewPropertyStream()

    // subscribes to signer stream in contact group service.
    this.subscribeToContactGroupSignerStream()

    // transforms valuation form values and validation based on changes to valuation data changes in UI
    this.subscribeToValuationFormChangesStream()

    // transform values for view (currency pipes etc)
    this.subscribeToInstructionFormChangesStream()

    // logs errors & updates view labels etc
    this.subscribeToAvailabilityFormChangesStream()

    // stream that adds admin contact to valuation when certain criteria hit
    this.subscribeToOpenContactGroupChangedStream()

    // shows val cancelled info when detects cancellation event from the shared service
    this.subscribeToCancelValuationStream()

    // handles notes for valuation
    this.subscribeToContactGroupNoteChangesStream()

    // for valuation status update
    this.subscribeToESignTriggerChangesStream()

    // another place that listens to change in contact group and updates the on on this page
    this.subscribeToContactGroupStreams()

    // updates notes page number on change
    this.subscribeToContactNotePageChangesStream()
  }

  private setupForms() {
    // builds valuation form
    this.setupValuationForm()

    // form for instructing a valuation. used in last step of the val process
    this.setupInstructionForm()

    // calendar availability form for booking appointments
    this.setupAvailabilityForm()
  }

  private subscribeToStorageStreams() {
    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      if (info) {
        this.setupListInfo(info)
      } else {
        this._valuationFacadeSvc
          .getDropDownInfo()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((data: ResultData | any) => {
            if (data) {
              this.setupListInfo(data.result)
            }
          })
      }
    })

    this.storage.get('currentUser').subscribe((currentStaffMember: StaffMember) => {
      if (currentStaffMember) {
        this.currentStaffMember = currentStaffMember
        if (
          currentStaffMember.activeDepartments[0].departmentId === enumDepartments.corporate_services ||
          currentStaffMember.activeDepartments[0].departmentId === enumDepartments.BDD
        ) {
          this.isClientService = true
          if (this.valuation && !(this.valuation.bookedById && this.valuation.bookedById > 0)) {
            this.valuation.bookedBy = this.currentStaffMember
            this.valuation.bookedById = this.currentStaffMember.staffMemberId
            if (this.leadTypeId == 0) this.valuation.originTypeId = 13
          }
        } else {
          this.isClientService = false
        }
      }
    })

    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.viewingArrangements = data.viewingArrangements
      }
    })
  }

  private setViewLevelPropsFromRouteParams() {
    this.valuationId = +this.route.snapshot.paramMap.get('id')
    this.propertyId = +this.route.snapshot.queryParamMap.get('propertyId')
    this.lastKnownOwnerId = +this.route.snapshot.queryParamMap.get('lastKnownOwnerId')
    this.originId = +this.route.snapshot.queryParamMap.get('originId')
    this.leadTypeId = +this.route.snapshot.queryParamMap.get('leadTypeId')
    this.isNewValuation = this.route.snapshot.queryParamMap.get('isNewValuation') as unknown as boolean
    this.isFromProperty = this.route.snapshot.queryParamMap.get('isFromProperty') as unknown as boolean
    this.isNewValuation && !this.isFromProperty ? (this.showProperty = true) : (this.showProperty = false)
  }

  /***
   * GET existing valuation from API or create NEW valuation
   */
  private addValuationDataToView() {
    if (this.valuationId > 0) {
      console.log('loading existing valuation. off I go!')
      this.getValuation(this.valuationId)
    } else {
      console.log('NEW valuation...')
      this.newValuation()
    }
  }

  private newValuation() {
    this.valuation = {
      valuationStatus: ValuationStatusEnum.None,
      valuationStatusDescription: 'New',
      originId: this.originId | 0,
      originTypeId: 0,
      declarableInterest: null,
      eSignSignatureTob: {}
    }
    this._valuationFacadeSvc._valuationData.next(this.valuation)
    this.setHeaderDropdownList(ValuationStatusEnum.None, 0)
    if (this.propertyId) {
      // new val for existing property, check to see if there's other active valuations
      this.controlPreviousValuations(this.propertyId)
      this.getPropertyInformation(this.propertyId)
    }
  }

  private subscribeToContactGroupSignerStream() {
    this.contactGroupService.signer$.subscribe((data) => {
      if (data) {
        this.lastKnownOwner = data
        this.createdSigner = data
        this.isCreatingNewSigner = false
      }
    })
  }

  private subscribeToValuationFormChangesStream() {
    this.valuationForm.valueChanges.subscribe((data) => {
      this.valuationForm.patchValue(
        {
          suggestedAskingRentShortLetMonthly: data.suggestedAskingRentShortLetMonthly
            ? this.sharedService.transformCurrency(this.shortLetMonthlyControl.value)
            : '',
          suggestedAskingRentLongLetMonthly: data.suggestedAskingRentLongLetMonthly
            ? this.sharedService.transformCurrency(this.longLetMonthlyControl.value)
            : '',
          suggestedAskingPrice: data.suggestedAskingPrice
            ? this.sharedService.transformCurrency(this.suggestedAskingPrice.value)
            : '',
          suggestedAskingRentShortLet: data.suggestedAskingRentShortLet
            ? this.sharedService.transformCurrency(this.shortLetWeeklyControl.value)
            : '',
          suggestedAskingRentLongLet: data.suggestedAskingRentLongLet
            ? this.sharedService.transformCurrency(this.longLetWeeklyControl.value)
            : ''
        },
        { emitEvent: false }
      )
      if (this.areValuesVisible && this.isThereAPrice(data) && this.setRequirementValuationNoteBs.getValue() == false) {
        this.setRequirementValuationNoteBs.next(true)
        this.valuationForm.controls['valuationNote'].setValidators([Validators.required, Validators.maxLength(1250)])
        this.valuationForm.controls['valuationNote'].updateValueAndValidity()
      } else {
        this.formErrors.valuationNote = null
      }
      this.sharedService.logValidationErrors(this.valuationForm, false)
      this.setRentFigures()
      this.checkAvailabilityBooking()
      this.controlStatus(data)
    })

    this.setRequirementValuationNoteBs.subscribe((data) => {
      if (data === true) {
        this.valuationForm.controls['valuationNote'].setValidators(null)
        this.valuationForm.controls['valuationNote'].updateValueAndValidity()
        this.formErrors.valuationNote = null
      }
    })

    this.valuationForm.controls['lettingsMeetingOwner'].valueChanges.subscribe((data) => {
      if (data == false) {
        this.setValidationForLettingsMeetingOwner(true)
      } else {
        this.setValidationForLettingsMeetingOwner(false)
      }
    })

    this.valuationForm.controls['salesMeetingOwner'].valueChanges.subscribe((data) => {
      if (data == false) {
        this.setValidationForSalesMeetingOwner(true)
      } else {
        this.setValidationForSalesMeetingOwner(false)
      }
    })

    this.valuationForm.controls['tenureId'].valueChanges.subscribe((data) => {
      this.onTenureChange(data)
    })

    this.valuationForm.controls['propertyFloorId'].valueChanges.subscribe((data) => {
      // console.log("propertyFloorId = ", data);
      if (+data === 10) {
        this.setValidationForPropertyFloorOther(true)
      } else {
        this.setValidationForPropertyFloorOther(false)
      }
    })
  }

  private subscribeToInstructionFormChangesStream() {
    this.instructionForm.valueChanges.pipe(debounceTime(100), distinctUntilChanged()).subscribe((form) => {
      this.instructionForm.patchValue(
        {
          askingPrice: form.askingPrice ? this.sharedService.transformCurrency(this.instAskingPriceControl.value) : '',
          askingRentLongLet: form.askingRentLongLet
            ? this.sharedService.transformCurrency(this.instLongLetWeeklyControl.value)
            : '',
          askingRentLongLetMonthly: form.askingRentLongLetMonthly
            ? this.sharedService.transformCurrency(this.instLongLetMonthlyControl.value)
            : '',
          askingRentShortLet: form.askingRentShortLet
            ? this.sharedService.transformCurrency(this.instShortLetWeeklyControl.value)
            : '',
          askingRentShortLetMonthly: form.askingRentShortLetMonthly
            ? this.sharedService.transformCurrency(this.instShortLetMonthlyControl.value)
            : ''
        },
        { emitEvent: false }
      )
      this.sharedService.logValidationErrors(this.instructionForm, false)
      this.setInstructionRentFigures()
    })
  }

  private setupAvailabilityForm() {
    // availability form
    this.availabilityForm = this.fb.group({
      fromDate: [new Date(), Validators.required],
      salesValuerId: [null, Validators.required],
      lettingsValuerId: [null, Validators.required],
      type: 'both'
    })
  }

  private subscribeToAvailabilityFormChangesStream() {
    this.availabilityForm.valueChanges.subscribe((data) => {
      this.sharedService.logValidationErrors(this.availabilityForm, false)
    })
    this.availabilityForm.controls['type'].valueChanges.subscribe((data) => {
      this.toggleValuerType()
    })
  }

  private subscribeToCancelValuationStream() {
    this.cancelValuationSubscription = this.sharedService.cancelValuationOperationChanged.subscribe((value) => {
      this.isCancelValuationVisible = value
    })
  }

  private subscribeToContactGroupNoteChangesStream() {
    this.contactGroupService.noteChanges$.subscribe((data) => {
      if (data) {
        this.contactNotes = []
        this.page = 1
        if (this.contactId) {
          this.getContactNotes()
        }
      }
    })
  }

  private subscribeToESignTriggerChangesStream() {
    this.eSignSubscription = this.sharedService.eSignTriggerChanged.subscribe((data: eSignTypes) => {
      if (data) {
        this._valuationFacadeSvc.createValuationESign(data, this.valuation.valuationEventId).subscribe((result) => {
          this.messageService.add({
            severity: 'success',
            summary: this.removeUnderLine(eSignTypes[data]) + ' send',
            closable: false
          })
        })
      }
    })
  }

  private subscribeToContactGroupStreams() {
    this.contactGroupSubscription = this._valuationFacadeSvc.contactGroup$.subscribe((result: ContactGroup) => {
      if (result?.contactGroupId && this.contactId != result?.contactGroupId) {
        if (!this.contactGroup) {
          this.contactGroup = result
          console.log(this.contactGroup)
        }
        this.contactId = result.contactGroupId
        this.getContactNotes()
      }
    })
  }

  private subscribeToContactNotePageChangesStream() {
    this.contactGroupService.contactNotePageChanges$.pipe(takeUntil(this.destroy)).subscribe((newPageNumber) => {
      this.page = newPageNumber
      if (this.contactId == null) {
        this.page = 0
      }
      this.getNextContactNotesPage(this.page)
    })
  }

  private subscribeToOpenContactGroupChangedStream() {
    this.openContactGroupSubscription = this.sharedService.openContactGroupChanged.subscribe((value) => {
      if (value === true) {
        if (this.lastKnownOwner && this.lastKnownOwner.companyName && this.lastKnownOwner.companyName.length > 0) {
          this.messageService.add({
            severity: 'warn',
            summary: 'You can not add admin contact to a company contact group!',
            closable: false
          })
          return
        }
        this.isAdminContactVisible = value
        this.sharedService.addAdminContactBs.next(true)
      }
    })

    this.removeContactGroupSubscription = this.sharedService.removeContactGroupChanged.subscribe((value) => {
      if (value === true) {
        this.removeAdminContact()
      }
    })
  }

  private buildSideNav() {
    let sideNavList = [...this.sidenavService.valuationSideNavItems]
    sideNavList.find((x) => x.name == 'valuationTicket').isCurrent = true
    this.sideNavItems = sideNavList
  }

  /***
   * END functions used by OnInit 👷
   */

  ngAfterViewInit(): void {
    if (this.sharedService.addedContactBs.getValue()) {
      if (this.sharedService.addAdminContactBs.getValue() === true) {
        this.getSignerDetails(this.sharedService.addedContactBs.getValue().contactGroupId)
          .then((signer: Signer) => {
            this.getSelectedAdminContact(signer)
          })
          .finally(() => {
            this.sharedService.addAdminContactBs.next(false)
            this.sharedService.addedContactBs.next(null)
            this.isAdminContactChanged = true
          })
      }
      if (this.sharedService.addLastOwnerBs.getValue() === true) {
        this.getSignerDetails(this.sharedService.addedContactBs.getValue().contactGroupId)
          .then((signer: Signer) => {
            this.getSelectedOwner(signer)
            this.changedLastOwner = signer
          })
          .finally(() => {
            this.sharedService.addLastOwnerBs.next(false)
            this.sharedService.addedContactBs.next(null)
          })
      }
    }

    this.setScrollInformation()
  }

  getSignerDetails(id: number) {
    return this.contactGroupService.getSignerbyId(id).toPromise()
  }

  controlStatus(data) {
    // console.log('controlStatus being set via')
    this.contactGroupLoading = false
    if (data) {
      if (this.valuation && this.valuation.valuationStatus === ValuationStatusEnum.None) {
        this.statuses.find((x) => x.value == 0).isNext = true
        this.statuses.find((x) => x.value == 1).isNext = true
        this.statuses.find((x) => x.value == 2).isNext = true
      }
      if (
        this.valuation &&
        (this.valuation.valuationStatus === ValuationStatusEnum.None ||
          this.valuation.valuationStatus === ValuationStatusEnum.Booked)
      ) {
        if (data.timeFrame && data.generalNotes && data.reason) {
          this.statuses.find((x) => x.value == 0).isValid = true
          this.statuses.find((x) => x.value == 0).isNext = false
        } else {
          this.statuses.find((x) => x.value == 0).isValid = false
          this.statuses.find((x) => x.value == 0).isNext = true
        }
        if (
          data.bathrooms != null &&
          data.receptions != null &&
          data.propertyTypeId &&
          data.propertyStyleId &&
          (data.propertyTypeId != 2 || (data.propertyTypeId == 2 && data.propertyFloorId > 0)) &&
          (data.propertyTypeId != 2 ||
            data.propertyFloorId != '10' ||
            (data.propertyTypeId == 2 && data.propertyFloorId == '10' && data.floorOther))
        ) {
          this.statuses.find((x) => x.value == 1).isValid = true
          this.statuses.find((x) => x.value == 1).isNext = false
        } else {
          this.statuses.find((x) => x.value == 1).isValid = false
          if (this.statuses.findIndex((x) => x.isNext === true) == -1)
            this.statuses.find((x) => x.value == 1).isNext = true
        }
        if (
          (data.salesValuer || data.lettingsValuer) &&
          (data.salesMeetingOwner != null || data.lettingsMeetingOwner != null)
        ) {
          this.statuses.find((x) => x.value == 2).isValid = true
          this.statuses.find((x) => x.value == 2).isNext = false
        } else {
          this.statuses.find((x) => x.value == 2).isValid = false
          if (this.statuses.findIndex((x) => x.isNext === true) == -1)
            this.statuses.find((x) => x.value == 2).isNext = true
        }
      } else {
        // if it is already in valued status that means before status will be done
        this.statuses.find((x) => x.value == 0).isValid = true
        this.statuses.find((x) => x.value == 1).isValid = true
        this.statuses.find((x) => x.value == 2).isValid = true
        this.statuses.find((x) => x.value == 0).isNext = false
        this.statuses.find((x) => x.value == 1).isNext = false
        this.statuses.find((x) => x.value == 2).isNext = false
      }

      if (this.isThereAPrice(data) && (this.setRequirementValuationNoteBs.getValue() === true || data.valuationNote)) {
        this.statuses.find((x) => x.value == 3).isValid = true
        this.statuses.find((x) => x.value == 3).isNext = false
      } else {
        this.statuses.find((x) => x.value == 3).isValid = false
        if (this.statuses.findIndex((x) => x.isNext === true) == -1) {
          if (!(this.valuation.valuationStatus === ValuationStatusEnum.None))
            this.statuses.find((x) => x.value == 3).isNext = true
        }
      }

      if (
        this.valuation.eSignSignatureTob &&
        (this.valuation.eSignSignatureTob.toBLetting || this.valuation.eSignSignatureTob.toBSale)
      ) {
        this.statuses.find((x) => x.value == 4).isValid = true
        this.statuses.find((x) => x.value == 4).isNext = false
      } else {
        this.statuses.find((x) => x.value == 4).isValid = false
        if (this.statuses.findIndex((x) => x.isNext === true) == -1) {
          if (
            !(
              this.valuation.valuationStatus === ValuationStatusEnum.Booked ||
              this.valuation.valuationStatus === ValuationStatusEnum.None
            )
          )
            this.statuses.find((x) => x.value == 4).isNext = true
        }
      }

      if (this._valuationFacadeSvc.landRegisterValid.getValue()) {
        // console.log('setting land registry traffic light to GREEN', this.statuses)
        this.statuses.find((x) => x.value == 6).isValid = true
        this.statuses.find((x) => x.value == 6).isNext = false
      } else {
        // console.log('setting land registry traffic light to AMBER ')
        this.statuses.find((x) => x.value == 6).isValid = false
        if (this.statuses.findIndex((x) => x.isNext === true) == -1) {
          if (
            !(
              this.valuation.valuationStatus === ValuationStatusEnum.Booked ||
              this.valuation.valuationStatus === ValuationStatusEnum.None
            )
          )
            this.statuses.find((x) => x.value == 6).isNext = true
        }
      }

      if (
        this.valuation &&
        this.valuation.complianceCheck &&
        this.valuation.complianceCheck.compliancePassedByFullName &&
        this.valuation.complianceCheck.compliancePassedByFullName.length > 0
      ) {
        this.statuses.find((x) => x.value == 9).isValid = true
        this.statuses.find((x) => x.value == 9).isNext = false
      } else {
        this.statuses.find((x) => x.value == 9).isValid = false
        if (this.statuses.findIndex((x) => x.isNext === true) == -1) {
          if (
            !(
              this.valuation.valuationStatus === ValuationStatusEnum.Booked ||
              this.valuation.valuationStatus === ValuationStatusEnum.None
            )
          )
            this.statuses.find((x) => x.value == 9).isNext = true
        }
      }

      if (
        this.valuation &&
        (this.valuation.valuationStatus === ValuationStatusEnum.Cancelled ||
          this.valuation.valuationStatus === ValuationStatusEnum.Closed ||
          this.valuation.valuationStatus === ValuationStatusEnum.Instructed)
      ) {
        this.statuses.forEach((x) => (x.isNext = false))
      }
    }
    if (this.statuses.findIndex((x) => x.isValid == false) === -1) {
      if (this.canDeactivate() === true) this.isDisabledInstructButton = false
      else this.isDisabledInstructButton = true
    } else {
      this.isDisabledInstructButton = true
    }
  }

  setScrollInformation() {
    const interval = setTimeout(() => {
      if (this.valuation?.valuationStatus == ValuationStatusEnum.None) this.scrollSpecificElement('appointmentTabs')
      else if (this.valuation?.valuationStatus == ValuationStatusEnum.Booked) this.scrollSpecificElement('valuesTab')
      else if (this.valuation?.valuationStatus == ValuationStatusEnum.Valued) {
        this.scrollSpecificElement('termsOfBusinessTab')
        this.activeState = [false, false, false, true, true, true, true]
      }
    }, 1000)
  }

  isThereAPrice(data) {
    if (
      data.suggestedAskingPrice ||
      data.suggestedAskingRentLongLet ||
      data.suggestedAskingRentShortLet ||
      data.suggestedAskingRentLongLetMonthly ||
      data.suggestedAskingRentShortLetMonthly
    ) {
      this.valuationForm.controls['valuationNote'].setValidators([Validators.required, Validators.maxLength(1250)])
      return true
    }
    this.valuationForm.controls['valuationNote'].setValidators(null)
    this.setRequirementValuationNoteBs.next(false)
    return false
  }

  scrollSpecificElement(idName: string) {
    //this.scroller.scrollToAnchor(idName);

    const scrollElement = document.getElementById(idName)
    if (scrollElement) {
      scrollElement.scrollIntoView()
    }
  }

  removeAdminContact() {
    this.adminContact = null
    this.isAdminContactChanged = true
    this.valuationForm.get('adminContact').setValue(this.adminContact)
    this.adminContactGroup = null
    this.sharedService.removeContactGroupChanged.next(null)
  }

  setShowMyNotesFlag(onlyMyNotes: boolean) {
    this.showOnlyMyNotes = onlyMyNotes
    this.contactNotes = []
    this.page = 0
    this.getContactNotes()
  }

  getContactNotes() {
    this.contactNotes = []
    this.getNextContactNotesPage(this.page)
  }

  addNote() {
    // console.log(this.dataNote, "data note...");

    this.sharedService.addNote(this.dataNote)
  }

  private getNextContactNotesPage(page: number) {
    if (this.contactId) {
      console.log('getNextContactNotesPage running')
      console.time('getnotes')
      this.contactGroupService
        .getContactGroupNotes(this.contactId, this.pageSize, page, this.showOnlyMyNotes)
        .subscribe((data) => {
          if (data) {
            console.timeEnd('getnotes')
            if (page === 1) {
              this.contactNotes = data
            } else {
              this.contactNotes = _.concat(this.contactNotes, data)
            }
          }
          this.setBottomReachedFlag(data)
        })
    }
  }

  private setBottomReachedFlag(result: any) {
    if (result && (!result.length || result.length < +this.pageSize)) {
      this.bottomReached = true
    } else {
      this.bottomReached = false
    }
  }

  getSelectedSideNavItem(event) {
    this.moreInfo = this.sidenavService.getSelectedItem(event?.type, event?.index, this.sideNavItems)
    if (event?.type == 'notes') {
      this.isNoteSelected = true
    } else {
      this.isNoteSelected = false
    }
  }

  getSelectedAdminContact(owner: Signer) {
    if (owner) {
      this.adminContact = {
        ...owner,
        ccOwner: this.valuation?.ccOwner,
        isPowerOfAttorney: this.valuation?.isPowerOfAttorney
      }
      this.isAdminContactChanged = true
      this.getAdminContactGroup(this.adminContact?.contactGroupId)
      this.valuationForm.get('adminContact').setValue(this.adminContact)
      this.isAdminContactVisible = false
      this.sharedService.openContactGroupChanged.next(false)
      this.sharedService.removeContactGroupChanged.next(false)
    }
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      console.log('getSelectedOwner: ', owner)
      this.lastKnownOwner = owner
      this.isOwnerChanged = true
      this.isLastKnownOwnerVisible = false
      this.getContactGroup(this.lastKnownOwner?.contactGroupId).then((result) => {
        this.contactGroup = result
        this.adminContactGroup = null
        this._valuationFacadeSvc.updateLocalContactGroup(this.contactGroup)
        this.getSearchedPersonSummaryInfo(this.contactGroup)
        this.isAdminContactChanged = false
      })
      this.valuationForm.get('propertyOwner').setValue(owner)
      if (this.property) {
        this.property.lastKnownOwner = owner
      }
      if (this.isEditable || this.isNewValuation) {
        this.valuationForm.markAsDirty()
      }
    }
  }

  setNewLastKnownOwner(owner: Signer) {
    console.log(' 🧍 setNewLastKnownOwner: ', owner)
    this.getSelectedOwner(owner)
    this._valuationFacadeSvc.changeLastKnownOwner(owner.contactGroupId)
  }

  setValidationForLettingsMeetingOwner(setValidation: boolean) {
    // this.valuationForm.controls['lettingsOwnerAssociateEmail'].setValidators(setValidation ? Validators.required : [])
    // this.valuationForm.controls['lettingsOwnerAssociateEmail'].updateValueAndValidity()
    // this.valuationForm.controls['lettingsOwnerAssociateName'].setValidators(setValidation ? Validators.required : [])
    // this.valuationForm.controls['lettingsOwnerAssociateName'].updateValueAndValidity()
    // this.valuationForm.controls['lettingsOwnerAssociateContactNumber'].setValidators(
    //   setValidation ? Validators.required : []
    // )
    // this.valuationForm.controls['lettingsOwnerAssociateContactNumber'].updateValueAndValidity()
  }

  setValidationForSalesMeetingOwner(setValidation: boolean) {
    // this.valuationForm.controls['salesOwnerAssociateEmail'].setValidators(setValidation ? Validators.required : [])
    // this.valuationForm.controls['salesOwnerAssociateEmail'].updateValueAndValidity()
    // this.valuationForm.controls['salesOwnerAssociateName'].setValidators(setValidation ? Validators.required : [])
    // this.valuationForm.controls['salesOwnerAssociateName'].updateValueAndValidity()
    // this.valuationForm.controls['salesOwnerAssociateContactNumber'].setValidators(
    //   setValidation ? Validators.required : []
    // )
    // this.valuationForm.controls['salesOwnerAssociateContactNumber'].updateValueAndValidity()
  }

  setValidationForPropertyFloorOther(isRequired: boolean) {
    // console.log("setValidationForPropertyFloorOther: ", isRequired);
    this.valuationForm.controls['floorOther'].setValidators(isRequired ? Validators.required : [])
    if (!isRequired) {
      this.valuationForm.controls['floorOther'].setValue(null)
    }
    this.valuationForm.controls['floorOther'].updateValueAndValidity()
  }

  selectValuersClick() {
    this.sideBarControlVisible = true
    this.thisWeek = []
    this.nextWeek = []
    this.nextTwoWeek = []
    this.showCalendar = false
  }

  toggleValuerType() {
    switch (this.valuationTypeControl.value) {
      case 'sales':
        this.isSalesOnly = true
        this.isLettingsOnly = false
        this.isSalesAndLettings = false
        this.availabilityForm.controls['lettingsValuerId'].setValidators(null)
        this.availabilityForm.controls['salesValuerId'].setValidators(Validators.required)
        this.bookingButtonLabel = 'Book For Sales'
        break
      case 'lettings':
        this.isLettingsOnly = true
        this.isSalesOnly = false
        this.isSalesAndLettings = false
        this.availabilityForm.controls['salesValuerId'].setValidators(null)
        this.availabilityForm.controls['lettingsValuerId'].setValidators(Validators.required)
        this.bookingButtonLabel = 'Book For Lettings'
        break

      default:
        this.isSalesAndLettings = true
        this.isLettingsOnly = false
        this.isSalesOnly = false
        this.availabilityForm.controls['lettingsValuerId'].setValidators(Validators.required)
        this.availabilityForm.controls['salesValuerId'].setValidators(Validators.required)
        this.bookingButtonLabel = 'Book For Sales and Lettings'
        break
    }
    this.isSplitAppointment = false
    this.availabilityForm.controls['salesValuerId'].updateValueAndValidity()
    this.availabilityForm.controls['lettingsValuerId'].updateValueAndValidity()
  }

  onSplitAppointmentChange(event) {
    this.isSplitAppointment = event.checked
    this.valuation.salesValuationBooking = null
    this.valuation.lettingsValuationBooking = null
    this._valuationFacadeSvc.updateLocalValuation(this.valuation)
    this.selectedSalesDate = null
    this.selectedLettingsDate = null
    this.selectedDate = null
    if (this.isSplitAppointment) this.bookingButtonLabel = 'Book For Sales'
    else this.bookingButtonLabel = 'Book For Sales and Lettings'
  }

  onSelectActiveValuation(valuation) {
    this.isCanDeactivate = true

    this.router
      .navigateByUrl('/', { skipLocationChange: false })
      .then(() => this.router.navigate(['valuations/detail/', valuation?.data?.valuationEventId, 'edit']))
  }

  private setupListInfo(info: DropdownListInfo) {
    this.tenures = [{ id: 0, value: 'Not Known' }, ...info.tenures]
    this.outsideSpaces = [...info.outsideSpaces]
    this.parkings = [...info.parkings]
    this.features = [...info.propertyFeatures]
    this.allOrigins = [...info.origins]
    this.allOriginTypes = info.originTypes.filter((x) => x.id == 12 || x.id == 13 || x.id == 14)
    this.interestList = [...info.section21Statuses]
    this.associateTypes = [...info.associations]
    this.propertyTypes = [{ id: 0, value: ' ' }, ...info.propertyTypes]
    this.allPropertyStyles = [{ id: 0, value: ' ' }, ...info.propertyStyles]
    this.propertyStyles = [{ id: 0, value: ' ' }, ...info.propertyStyles]
    this.propertyFloors = [{ id: 0, value: ' ' }, ...info.propertyFloors]
  }

  getPropertyDetails(propertyId: number) {
    return this.propertyService
      .getProperty(propertyId, true, true, false, true)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe((result) => {
        if (result) {
          this.setPropertyDetail(result)
          if (!this.valuation.valuationEventId || this.valuation.valuationEventId === 0) {
            this.valuation.deedLandRegFiles = result.deedLandRegFiles
            this.valuation.leaseLandRegFiles = result.leaseLandRegFiles
            this.valuation.nameChangeRegFiles = result.nameChangeRegFiles
          }
          this._valuationFacadeSvc.updateLocalValuation(this.valuation)
        }
      })
  }

  /***
   * sets property details for the view. called when valuation is loaded, saved,
   */
  setPropertyDetail(propertyDetails) {
    if (propertyDetails.lastKnownOwner) this.lastKnownOwner = propertyDetails.lastKnownOwner
    else {
      this.lastKnownOwner = this.valuation?.propertyOwner
    }

    this.sharedService.valuationLastOwnerChanged.next(this.lastKnownOwner)

    if (this.changedLastOwner && this.changedLastOwner.contactGroupId > 0) {
      this.lastKnownOwner = { ...this.changedLastOwner }
      propertyDetails.lastKnownOwner = this.lastKnownOwner
      this.changedLastOwner = null
    }

    this.property = propertyDetails
    this.valuation.property = { ...this.property }
    this.valuation.officeId = this.property.officeId
    this._valuationFacadeSvc.updateLocalValuation(this.valuation)
    // this.valuers = result.valuers;
    if (this.lastKnownOwner && this.lastKnownOwner.contactGroupId > 0) {
      // console.log('valuation has a last known owner, off to fetch their contact group')
      this.getContactGroup(this.lastKnownOwner.contactGroupId).then((result) => {
        this.contactGroup = result
        console.log(this.contactGroup)
        this._valuationFacadeSvc.updateLocalContactGroup(this.contactGroup)
        this.getSearchedPersonSummaryInfo(this.contactGroup)
      })
    }

    const baseProperty = {
      propertyId: this.property.propertyId,
      address: this.property.address,
      officeId: this.property.officeId
    } as BaseProperty
    this.valuationForm.get('property').setValue(baseProperty)

    this.onPropertyType(this.property.propertyTypeId)
    this.valuationForm.patchValue({
      propertyStyleId: this.property.propertyStyleId,
      propertyTypeId: this.property.propertyTypeId,
      propertyFloorId: this.property['propertyFloorId'],
      floorOther: this.property['floorOther']
    })
  }

  getContactGroup(contactGroupId: number) {
    return this.contactGroupService.getContactGroupById(contactGroupId, true).toPromise()
  }

  getAdminContactGroup(contactGroupId: number) {
    console.log('getting admin contact group...')
    this.contactGroupSubscription = this.contactGroupService
      .getContactGroupById(contactGroupId, true)
      .subscribe((result) => {
        this.adminContactGroup = result
        if (this.adminContactGroup.contactPeople && this.adminContactGroup.contactPeople.length > 0) {
          this.adminContactGroup.contactPeople[0].isAdminContact = true
          this.adminContact.id = this.adminContactGroup.contactPeople[0].personId
        }
        this.adminContactGroup.contactPeople = this.adminContactGroup.contactPeople.concat(
          this.contactGroup?.contactPeople
        )
        // console.log(this.adminContactGroup.contactPeople);
      })
  }

  setInstructionRentFigures() {
    if (this.instShortLetWeeklyControl.value) {
      this.setMonthlyRent(this.instShortLetWeeklyControl, this.instShortLetMonthlyControl)
    }
    if (this.instLongLetWeeklyControl.value) {
      this.setMonthlyRent(this.instLongLetWeeklyControl, this.instLongLetMonthlyControl)
    }
    if (this.instShortLetMonthlyControl.value) {
      this.setWeeklyRent(this.instShortLetWeeklyControl, this.instShortLetMonthlyControl)
    }
    if (this.instLongLetMonthlyControl.value) {
      this.setWeeklyRent(this.instLongLetWeeklyControl, this.instLongLetMonthlyControl)
    }
  }

  setupInitialRentFigures(val: Valuation) {
    if (val.suggestedAskingRentShortLet && !val.suggestedAskingRentShortLetMonthly) {
      this.shortLetMonthlyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentShortLet))
    }
    if (val.suggestedAskingRentLongLet && !val.suggestedAskingRentLongLetMonthly) {
      this.longLetMonthlyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentLongLet))
    }
    if (val.suggestedAskingRentShortLetMonthly && !val.suggestedAskingRentShortLet) {
      this.shortLetWeeklyControl.setValue(this.calculateWeeklyRent(+val.suggestedAskingRentShortLetMonthly))
    }
    if (val.suggestedAskingRentLongLetMonthly && !val.suggestedAskingRentLongLet) {
      this.longLetWeeklyControl.setValue(this.calculateMonthlyRent(+val.suggestedAskingRentLongLetMonthly))
    }
  }

  setRentFigures() {
    this.setMonthlyRent(this.shortLetWeeklyControl, this.shortLetMonthlyControl)
    this.setWeeklyRent(this.shortLetWeeklyControl, this.shortLetMonthlyControl)
    this.setMonthlyRent(this.longLetWeeklyControl, this.longLetMonthlyControl)
    this.setWeeklyRent(this.longLetWeeklyControl, this.longLetMonthlyControl)
  }

  private setMonthlyRent(weeklyControl: FormControl, monthlyControl: FormControl) {
    weeklyControl.valueChanges.subscribe((rent) => {
      rent = this.sharedService.convertStringToNumber(rent)
      monthlyControl.setValue(this.calculateMonthlyRent(rent), {
        emitEvent: false
      })
    })
  }

  private setWeeklyRent(weeklyControl: FormControl, monthlyControl: FormControl) {
    monthlyControl.valueChanges.subscribe((rent) => {
      rent = this.sharedService.convertStringToNumber(rent)
      weeklyControl.setValue(this.calculateWeeklyRent(rent), {
        emitEvent: false
      })
    })
  }

  calculateMonthlyRent(rent: number): string {
    let monthlyRent: string
    if (rent > 0) {
      monthlyRent = (rent * (52 / 12)).toFixed(0)
    }
    return monthlyRent
  }

  calculateWeeklyRent(rent: number): string {
    let weeklyRent: string
    if (rent > 0) {
      weeklyRent = (rent * (12 / 52)).toFixed(0)
    }
    return weeklyRent
  }

  setupValuationForm() {
    this.valuationForm = this.fb.group({
      property: [''],
      propertyOwner: [''],
      originType: [0],
      originId: [0],
      reason: ['', [Validators.required, Validators.maxLength(1250)]],
      timeFrame: ['', [Validators.required, Validators.maxLength(1250)]],
      generalNotes: ['', [Validators.required, Validators.maxLength(1250)]],
      bedrooms: [0, Validators.max(99)],
      bathrooms: [0, Validators.max(99)],
      receptions: [0, Validators.max(99)],
      sqFt: [0],
      tenureId: [],
      outsideSpace: [],
      parking: [],
      propertyFeature: [''],
      approxLeaseExpiryDate: [null, [Validators.max(999), Validators.min(1)]],
      salesValuer: [''],
      lettingsValuer: [''],
      isInvitationSent: true,
      totalHours: [1],
      valuationDate: [''],
      suggestedAskingPrice: [],
      suggestedAskingRentLongLet: [],
      suggestedAskingRentShortLet: [],
      suggestedAskingRentLongLetMonthly: [],
      suggestedAskingRentShortLetMonthly: [],
      ageOfSuggestedAskingPrice: [],
      salesMeetingOwner: [true],
      lettingsMeetingOwner: [true],
      salesOwnerAssociateName: [''],
      salesOwnerAssociateContactNumber: [''],
      salesOwnerAssociateEmail: [''],
      salesOwnerAssociateType: ['6'],
      lettingsOwnerAssociateName: [''],
      lettingsOwnerAssociateContactNumber: [''],
      lettingsOwnerAssociateEmail: [''],
      lettingsOwnerAssociateType: ['6'],
      propertyStyleId: [null, Validators.required],
      propertyTypeId: [null, Validators.required],
      propertyFloorId: [],
      floorOther: [],
      isRetirementHome: [false],
      isNewBuild: [false],
      hasDisabledAccess: [false],
      adminContact: [],
      valuationNote: []
    })
  }

  setupInstructionForm() {
    this.instructionForm = this.fb.group({
      instructSale: [false],
      instructLet: [false],
      salesAgencyType: [''],
      lettingsAgencyType: [''],
      askingPrice: [],
      askingRentLongLet: [],
      askingRentShortLet: [],
      askingRentLongLetMonthly: [],
      askingRentShortLetMonthly: [],
      isInstructLongLet: [],
      isInstructShortLet: []
    })
  }

  private setValuersForSalesAndLettings() {
    this.salesValuers = this.allValuers.sales
    this.lettingsValuers = this.allValuers.lettings
  }

  /***
   * @description loads a valuation from the API into the view.
   * TODO: reduce/tidy the state/logic involved in loading a valuation
   */
  getValuation(id: number) {
    console.log('👷 getVal step 1: getValuationById from API')
    this._valuationFacadeSvc
      .getValuationById(id)
      .toPromise()
      .then((data) => {
        console.log('👷 getVal step 2: valuation data from API: ', data)
        if (data) {
          this.valuation = data
          // what is this doing here and why?
          this.propertyId = this.valuation.property.propertyId // ???!
          if (this.propertyId) {
            console.log(
              '👷 getVal step 3 a: propertyId found on valuation.property object, off to call API to getProperty ',
              this.propertyId
            )
            return this.propertyService.getProperty(this.propertyId, true, true, false, true).toPromise()
          }
          console.log(
            '👷 getVal step 3 b: property object exists on valuation (but not propertyId?!), resolve property to next step'
          )
          return of(this.valuation.property).toPromise()
        }
      })
      .then((result) => {
        console.log('👷 getVal step 4: setPropertyDetail, getValuationPropertyInfo, getValuers ')
        this.setPropertyDetail(result)
        this.getValuers(this.propertyId)
      })
      .then(() => {
        console.log(`👷 
        getValuation step 5: set following view props based mostly off this.valuation state: 
        headerDropdownList, 
        canInstruct, 
        isEditable, 
        isCancelled, 
        isPropertyInfoDisabled, 
        canSaveValuation, 
        property, 
        valuation.property,
        isValuationNotesVisible,
        optional navigation to cancelled state,
        valuation.cancelledBy,
        cancelReasonString,
        showDateAndDuration,
        valuation.salesValuer,
        valuation.combinedValuationBooking,
        valuation.salesValuationBooking,
        valuation.lettingsValuationBooking,
        selectedLettingsDate,
        selectedSalesDate,
        getTimeSalesValuationDate,
        getTimeLettingsValuationDate,
        lastKnownOwner,
        contactGroup,
        contactGroupLoading,
        isAllowedForValueChanges,
        isValuationMeetingNotesVisible
        `)
        this.setHeaderDropdownList(this.valuation.valuationStatus, this.valuation.valuationType)
        this.valuation.valuationStatus === 3 ? (this.canInstruct = true) : (this.canInstruct = false)
        this.valuation.approxLeaseExpiryDate ? (this.showLeaseExpiryDate = true) : (this.showLeaseExpiryDate = false)
        if (
          this.valuation.valuationStatus === ValuationStatusEnum.Instructed ||
          this.valuation.valuationStatus === ValuationStatusEnum.Valued ||
          this.valuation.valuationStatus === ValuationStatusEnum.Cancelled ||
          this.valuation.valuationStatus === ValuationStatusEnum.Closed
        ) {
          this.isEditable = false
        } else {
          this.isEditable = true
        }
        if (this.valuation.valuationStatus === ValuationStatusEnum.Instructed) {
          this.isCancelled = true
        }
        if (
          this.valuation.valuationStatus === ValuationStatusEnum.Instructed ||
          this.valuation.valuationStatus === ValuationStatusEnum.Cancelled ||
          this.valuation.valuationStatus === ValuationStatusEnum.Closed
        ) {
          this.isPropertyInfoDisabled = true
          this.canSaveValuation = false
          this.property = {
            ...this.property,
            leaseExpiryDate: this.valuation.leaseExpiryDate,
            userEnteredOwner: this.valuation.userEnteredOwner
          }
          this.valuation.property = this.property
        } else {
          this.canSaveValuation = true
        }

        if (this.valuation.valuationStatus >= ValuationStatusEnum.Valued && !this.valuation.reason) {
          this.isValuationNotesVisible = false
        }

        if (
          this.valuation.valuationStatus === ValuationStatusEnum.Cancelled ||
          this.valuation.valuationStatus === ValuationStatusEnum.Closed
        ) {
          if (this.route.snapshot.routeConfig?.path?.indexOf('edit') > -1) {
            let path = ['valuations/detail', this.valuation.valuationEventId, 'cancelled']
            this.router.navigate(path)
            return
          }
          this.isCancelled = true
          if (this.valuation.valuationStatus === ValuationStatusEnum.Cancelled) {
            this.cancelString = `Cancelled ${moment(this.valuation.cancelledDate).format('Do MMM YYYY (HH:mm)')} by ${
              this.valuation.cancelledBy?.fullName
            } `
            this.cancelReasonString =
              'Reason for cancellation: ' +
              (this.valuation.cancellationTypeId == ValuationCancellationReasons.Other
                ? this.valuation.cancellationReason
                : this.removeUnderLine(ValuationCancellationReasons[this.valuation.cancellationTypeId]))
          } else {
            this.cancelString = this.valuation.cancellationReason
          }
        }

        if (this.valuation.salesValuer || this.valuation.lettingsValuer) {
          if (this.isEditable) {
            if (this.valuation.valuationDate) {
              this.showDateAndDuration = true
            } else {
              this.showDateAndDuration = false
            }
          }
          this.salesValuerIdControl.setValue(
            this.valuation.salesValuer ? this.valuation.salesValuer.staffMemberId : null
          )
          this.lettingsValuerIdControl.setValue(
            this.valuation.salesValuer ? this.valuation.salesValuer.staffMemberId : null
          )
          if (this.valuation.combinedValuationBooking) {
            this.valuation.salesValuationBooking = {
              ...this.valuation.combinedValuationBooking
            }
            this.valuation.lettingsValuationBooking = {
              ...this.valuation.combinedValuationBooking
            }
          }

          this.selectedLettingsDate = this.valuation.lettingsValuationBooking?.startDateTime
            ? new Date(this.valuation.lettingsValuationBooking?.startDateTime)
            : null
          this.selectedSalesDate = this.valuation.salesValuationBooking?.startDateTime
            ? new Date(this.valuation.salesValuationBooking?.startDateTime)
            : null

          this.getTimeSalesValuationDate = this.selectedSalesDate?.getTime()
          this.getTimeLettingsValuationDate = this.selectedLettingsDate?.getTime()
        }

        if (this.valuation.property) {
          if (
            this.valuation &&
            (this.valuation.valuationStatus == ValuationStatusEnum.Closed ||
              this.valuation.valuationStatus == ValuationStatusEnum.Cancelled ||
              this.valuation.valuationStatus == ValuationStatusEnum.Instructed)
          ) {
            this.lastKnownOwner = this.valuation?.propertyOwner
          } else {
            this.lastKnownOwner = this.valuation.property.lastKnownOwner
              ? this.valuation.property.lastKnownOwner
              : this.valuation.propertyOwner
          }

          this.sharedService.valuationLastOwnerChanged.next(this.lastKnownOwner)

          if (this.lastKnownOwner && this.lastKnownOwner.contactGroupId > 0) {
            // console.log('valuation has last know owner, off to fetch their contact group') // WIP
            this.getContactGroup(this.valuation.propertyOwner?.contactGroupId).then((result) => {
              this.contactGroup = result
              console.log('======================= ', result)
              this._valuationFacadeSvc.updateLocalContactGroup(this.contactGroup)
              this.getSearchedPersonSummaryInfo(this.contactGroup)
              this.setAdminContact()
              this.contactGroupLoading = false
            }) // get contact group for last know owner
          }
        }

        this.setValuationType(this.valuation)
        this.populateForm(this.valuation)
        this.setupInitialRentFigures(this.valuation)

        this._valuationFacadeSvc.updateLocalValuation(this.valuation)

        this.isAllowedForValueChangesSubscription = this.staffMemberService
          .hasCurrentUserValuationCreatePermission()
          .subscribe((userHasPermission: boolean) => {
            this.isAllowedForValueChanges = userHasPermission
          })

        if (
          this.valuation.valuationStatus >= ValuationStatusEnum.Valued &&
          !this.isStillInOneMonthPeriod &&
          (!this.valuation.valuationContactNote || !this.valuation.valuationContactNote.text)
        ) {
          this.isValuationMeetingNotesVisible = false
          this.setRequirementValuationNoteBs.next(true)
        }

        setTimeout(() => {
          // HACK! TODO find out when to call controlStatus (after the valuation call has been made in the valuation-land-register.component)
          this.controlStatus(this.valuation)
        }, 1000)

        // this.store.loadStore() // loads NGRX component store for this valuation. Objective is to centralise the state and put this class on a strict diet!
        console.log(`👷 getValuation done`)
      })
      .catch((err) => {
        console.log('👷 getValuation err: ', err)
      })
  }

  setHeaderDropdownList(status, valuationType) {
    this.sharedService.valuationType.next(valuationType)
    this.sharedService.valuationStatusChanged.next(status)
  }

  // ???? what is the point of this function?
  controlIsCancelled(control: boolean) {
    if (control) {
      return false
    }
  }

  removeUnderLine(str: string): string {
    return str.replaceAll('_', ' ')
  }

  getSearchedPersonSummaryInfo(contactGroup: ContactGroup) {
    this.mainPersonId = this.contactGroup.contactPeople?.find((x) => x.isMainPerson).personId
    this.contactId = contactGroup.contactGroupId
    // console.log(this.contactId);
    this.storage.get(this.mainPersonId.toString()).subscribe((data: PersonSummaryFigures) => {
      if (data) {
        this.summaryTotals = data
      } else {
        this.contactGroupService.getPersonInfo(this.mainPersonId).subscribe((data) => {
          this.summaryTotals = data
          this.storage.set(this.mainPersonId.toString(), this.summaryTotals).subscribe()
        })
      }
    })
  }

  // getPersonDetails(personId: number) {
  //   this.contactGroupService.getPerson(personId, true).subscribe((data) => {
  //     if (data) {
  //       this.person = data;
  //     }
  //   });
  // }

  setAdminContact() {
    if (this.valuation.adminContact && this.valuation.adminContact.contactGroupId > 0)
      this.getSelectedAdminContact(this.valuation.adminContact)
    else if (
      !(this.valuationForm.get('adminContact').value && this.valuationForm.get('adminContact').value.contactGroupId > 0)
    ) {
      this.sharedService.removeContactGroupChanged.next(null)
    }
  }

  getPropertyInformation(propertyId) {
    this.propertyId = propertyId
    if (this.propertyId) {
      this.getPropertyDetails(this.propertyId)
      this.getValuationPropertyInfo(this.propertyId)
      this.getValuers(this.propertyId)
    }
  }

  setValuationInformation(valuationBooking: ValuationBooking, type: string) {
    if (type == 'both' || type == 'sales') {
      this.salesMeetingOwner = valuationBooking.meetingOwner
      this.salesOwnerAssociateName = valuationBooking.name
      this.salesOwnerAssociateContactNumber = valuationBooking.contactNumber
      this.salesOwnerAssociateEmail = valuationBooking.emailAddress
      this.salesOwnerAssociateType = valuationBooking.associationId
    } else if (type == 'lettings') {
      this.lettingsMeetingOwner = valuationBooking.meetingOwner
      this.lettingsOwnerAssociateName = valuationBooking.name
      this.lettingsOwnerAssociateContactNumber = valuationBooking.contactNumber
      this.lettingsOwnerAssociateEmail = valuationBooking.emailAddress
      this.lettingsOwnerAssociateType = valuationBooking.associationId
    }

    // lettingsOwnerWantsMessage;
  }

  studioLabelCheck(bedroomCount) {
    this.showStudioLabel = !bedroomCount || bedroomCount == 0
  }

  populateForm(valuation: Valuation) {
    if (valuation) {
      if (!this.valuation.lockDate || new Date(this.valuation.lockDate) > new Date()) {
        this.isStillInOneMonthPeriod = true
      }

      this.studioLabelCheck(valuation.bedrooms)
      if (valuation.combinedValuationBooking || valuation.salesValuationBooking) {
        this.setValuationInformation(
          valuation.combinedValuationBooking ? valuation.combinedValuationBooking : valuation.salesValuationBooking,
          'both'
        )
      }
      if (valuation.lettingsValuationBooking) {
        this.setValuationInformation(valuation.lettingsValuationBooking, 'lettings')
      }

      this.salesValuer = { ...this.valuation.salesValuer }
      this.lettingsValuer = { ...this.valuation.lettingsValuer }

      this.adminContact = {
        ...valuation.adminContact,
        isPowerOfAttorney: valuation.isPowerOfAttorney,
        ccOwner: valuation.ccOwner
      }

      this.onPropertyType(valuation.property?.propertyTypeId)
      console.log('1 about to patchValue on valuationForm  ', valuation)
      this.valuationForm.patchValue({
        property: valuation.property,
        propertyOwner: valuation.propertyOwner,
        reason: valuation.reason,
        timeFrame: valuation.timeFrame,
        generalNotes: valuation.generalNotes,
        bedrooms: valuation.bedrooms || 0,
        bathrooms: valuation.bathrooms || 0,
        receptions: valuation.receptions || 0,
        tenureId: valuation.tenureId || 0,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(valuation.approxLeaseExpiryDate),
        sqFt: this.isEditable ? valuation.sqFt || 0 : valuation.sqFt || 'Not Known',
        outsideSpace: this.getInfoDetailValues(valuation.outsideSpace, this.outsideSpaces),
        parking: this.getInfoDetailValues(valuation.parking, this.parkings),
        propertyFeature: valuation.propertyFeature,
        salesValuer: valuation.salesValuer,
        lettingsValuer: valuation.lettingsValuer,
        type: this.setInitialType(),
        valuationDate: valuation.valuationDate,
        totalHours: valuation.totalHours || 1,
        suggestedAskingPrice: valuation.suggestedAskingPrice ? valuation.suggestedAskingPrice : '',
        suggestedAskingRentLongLet: valuation.suggestedAskingRentLongLet ? valuation.suggestedAskingRentLongLet : '',
        suggestedAskingRentLongLetMonthly: valuation.suggestedAskingRentLongLetMonthly
          ? valuation.suggestedAskingRentLongLetMonthly
          : '',
        suggestedAskingRentShortLet: valuation.suggestedAskingRentShortLet ? valuation.suggestedAskingRentShortLet : '',
        suggestedAskingRentShortLetMonthly: valuation.suggestedAskingRentShortLetMonthly
          ? valuation.suggestedAskingRentShortLetMonthly
          : '',
        instructLet:
          valuation.suggestedAskingRentLongLetMonthly || valuation.suggestedAskingRentShortLet ? true : false,

        ageOfSuggestedAskingPrice: valuation.valuationDate
          ? this.sharedService.calculateDateToNowInMonths(new Date(valuation.valuationDate))
          : 0,
        salesMeetingOwner: this.salesMeetingOwner,
        lettingsMeetingOwner: this.lettingsMeetingOwner,
        salesOwnerAssociateName: this.salesOwnerAssociateName,
        salesOwnerAssociateContactNumber: this.salesOwnerAssociateContactNumber,
        salesOwnerAssociateEmail: this.salesOwnerAssociateEmail,
        salesOwnerAssociateType: this.salesOwnerAssociateType,
        lettingsOwnerAssociateName: this.lettingsOwnerAssociateName,
        lettingsOwnerAssociateContactNumber: this.lettingsOwnerAssociateContactNumber,
        lettingsOwnerAssociateEmail: this.lettingsOwnerAssociateEmail,
        lettingsOwnerAssociateType: this.lettingsOwnerAssociateType,
        propertyStyle: valuation.property?.propertyStyleId,
        propertyType: valuation.property?.propertyTypeId,
        propertyFloor: valuation.property?.propertyFloorId,
        floorOther: valuation.property?.floorOther,
        isRetirementHome: valuation.otherFeatures
          ? valuation.otherFeatures.findIndex((x) => x === OtherFeatures.Retirement_Home) > -1
            ? true
            : false
          : false,
        isNewBuild: valuation.otherFeatures
          ? valuation.otherFeatures.findIndex((x) => x === OtherFeatures.New_Build) > -1
            ? true
            : false
          : false,
        hasDisabledAccess: valuation.propertyFeature
          ? valuation.propertyFeature.findIndex((x) => x === PropertyFeatures.Disabled_Access) > -1
            ? true
            : false
          : false,
        valuationNote: valuation.valuationContactNote?.text
      })

      this.onTenureChange(this.valuationForm.get('tenureId').value)

      if (!this.isEditable && !this.isNewValuation && !this.isStillInOneMonthPeriod) {
        this.valuationForm.get('generalNotes').disable()
        this.valuationForm.get('timeFrame').disable()
        this.valuationForm.get('reason').disable()
        this.valuationForm.get('propertyTypeId').disable()
        this.valuationForm.get('propertyFloorId').disable()
        this.valuationForm.get('floorOther').disable()
        this.valuationForm.get('propertyStyleId').disable()
        this.valuationForm.get('isNewBuild').disable()
        this.valuationForm.get('isRetirementHome').disable()
        this.valuationForm.get('bedrooms').disable()
        this.valuationForm.get('bathrooms').disable()
        this.valuationForm.get('receptions').disable()
        this.valuationForm.get('sqFt').disable()
        this.valuationForm.get('tenureId').disable()
        this.valuationForm.get('approxLeaseExpiryDate').disable()
        this.valuationForm.get('outsideSpace').disable()
        this.valuationForm.get('parking').disable()
        this.valuationForm.get('hasDisabledAccess').disable()
        this.valuationForm.get('salesMeetingOwner').disable()
        this.valuationForm.get('salesOwnerAssociateName').disable()
        this.valuationForm.get('salesOwnerAssociateContactNumber').disable()
        this.valuationForm.get('salesOwnerAssociateEmail').disable()
        this.valuationForm.get('salesOwnerAssociateType').disable()
        this.valuationForm.get('lettingsMeetingOwner').disable()
        this.valuationForm.get('lettingsOwnerAssociateName').disable()
        this.valuationForm.get('lettingsOwnerAssociateContactNumber').disable()
        this.valuationForm.get('lettingsOwnerAssociateEmail').disable()
        this.valuationForm.get('lettingsOwnerAssociateType').disable()
      }
    }
  }

  getStatusColor() {
    if (this.valuation) {
      if (this.valuation.valuationStatus == ValuationStatusEnum.Booked) return '#4DA685'
      else if (this.valuation.valuationStatus == ValuationStatusEnum.Cancelled) {
        return '#E02020'
      } else if (this.valuation.valuationStatus == ValuationStatusEnum.Instructed) {
        return '#0A1A4A'
      } else if (this.valuation.valuationStatus == ValuationStatusEnum.Valued) {
        return '#3498DB'
      } else if (this.valuation.valuationStatus == ValuationStatusEnum.Closed) {
        return '#FFB134'
      }
    }
  }

  setInitialType(): string {
    let type = 'both'
    if (this.valuation.salesValuer && !this.valuation.lettingsValuer) {
      type = 'sales'
    }
    if (this.valuation.lettingsValuer && !this.valuation.salesValuer) {
      type = 'lettings'
    }
    return type
  }

  displayValuationPropInfo(info: ValuationPropertyInfo) {
    if (info) {
      console.log('displayValuationPropInfo running and will change sqFt to ', info.sqFt)
      this.studioLabelCheck(info.bedrooms)
      this.valuationForm.patchValue({
        bedrooms: info.bedrooms || 0,
        bathrooms: info.bathrooms || 0,
        receptions: info.receptions || 0,
        tenureId: info.tenureId || this.valuationForm.get('tenureId').value,
        approxLeaseExpiryDate: this.changeLeaseExpiryDateToYears(info.approxLeaseExpiryDate),
        sqFt: info.sqFt || 0,
        outsideSpace: this.getInfoDetailValues(info.outsideSpace, this.outsideSpaces),
        parking: this.getInfoDetailValues(info.parking, this.parkings),
        propertyFeature: info.propertyFeature
      })
    }
  }

  getInfoDetailValues(propertyInfo: any[], data: InfoDetail[]): InfoDetail[] {
    let infoDetail: InfoDetail[] = []
    if (propertyInfo && propertyInfo.length > 0 && data) {
      propertyInfo.forEach((value) => {
        infoDetail.push(data.find((info) => info.id == value))
      })
    }
    return infoDetail
  }

  populateInstructionForm(instruction: Instruction) {
    if (instruction) {
      this.instructionForm.patchValue({
        salesAgencyType: instruction.salesAgencyType,
        lettingsAgencyType: instruction.lettingsAgencyType,
        askingPrice: instruction.askingPrice ? instruction.askingPrice : '',
        askingRentLongLet: instruction.askingRentLongLet ? instruction.askingRentLongLet : '',
        askingRentLongLetMonthly: instruction.askingRentLongLetMonthly ? instruction.askingRentLongLetMonthly : '',
        askingRentShortLet: instruction.askingRentShortLet ? instruction.askingRentShortLet : '',
        askingRentShortLetMonthly: instruction.askingRentShortLetMonthly ? instruction.askingRentShortLetMonthly : '',
        instructLet: instruction.askingRentLongLetMonthly || instruction.askingRentShortLetMonthly ? true : false,
        instructSale: instruction.askingPrice ? true : false,
        isInstructLongLet: instruction.askingRentLongLetMonthly ? true : false,
        isInstructShortLet: instruction.askingRentShortLet ? true : false
      })
    }
  }

  setValuationType(val: Valuation) {
    switch (true) {
      case val.salesValuer && !val.lettingsValuer:
        this.isSalesOnly = true
        this.isSalesAndLettings = false
        this.isLettingsOnly = false
        break

      case val.lettingsValuer && !val.salesValuer:
        this.isLettingsOnly = true
        this.isSalesOnly = false
        this.isSalesAndLettings = false
        break

      default:
        this.isSalesAndLettings = true
        this.isLettingsOnly = false
        this.isSalesOnly = false
    }
  }

  ageColor(value: any): string {
    if (value >= 0) {
      if (value < 4) return 'green'
      if (value < 7) return '#CF5E02'
      return 'red'
    }
    return null
  }

  /***
   * fetches any valuations for the property and shows them in a list inside a dialog for the user to select from
   */
  controlPreviousValuations(propertyId) {
    this.propertySubscription = this.propertyService
      .getValuations(propertyId, true)
      .pipe(
        map((valuations: Valuation[]) =>
          valuations.map((valuation: Valuation) => {
            return {
              ...valuation,
              valuationStatusDescription: ValuationStatusEnum[valuation.valuationStatus]
            }
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
          )
          this.isActiveValuationsVisible = this.activeValuations.length > 0 ? true : false
        }
      })
  }

  getSelectedProperty(property: Property) {
    if (property) {
      this.controlPreviousValuations(property.propertyId)

      this.valuers = []
      this.property = property
      this.isPropertyChanged = true
      this.valuation.property = property
      this._valuationFacadeSvc.updateLocalValuation(this.valuation)
      this.lastKnownOwner = property.lastKnownOwner
      if (this.lastKnownOwner && this.lastKnownOwner.contactGroupId > 0) {
        this.getContactGroup(this.property?.lastKnownOwner?.contactGroupId).then((result) => {
          this.contactGroup = result
          console.log(this.contactGroup)
          this._valuationFacadeSvc.updateLocalContactGroup(this.contactGroup)
          this.getSearchedPersonSummaryInfo(this.contactGroup)
          this.contactGroupLoading = false
        })
      }
      this.valuationForm.get('property').setValue(property)
      this.valuationForm.get('propertyOwner').setValue(this.lastKnownOwner)
      this.getValuers(property.propertyId)
      this.getValuationPropertyInfo(property.propertyId)
      this.getPropertyDetails(property.propertyId)

      if (this.valuation.originId == 0) {
        this.propertyService
          .getPropertyInstructions(property.propertyId, true)
          .toPromise()
          .then((data) => {
            if (data && data.length > 0 && data.findIndex((x) => x.type.toLocaleLowerCase() == 'lettings') > -1) {
              this.isRelet = true
            }
          })
      }

      this.showProperty = false
      this.valuationForm.markAsDirty()
    }
  }

  onClosePropertyFinder() {
    if (!(this.property && this.property.propertyId > 0)) {
      this.router.navigate(['/valuations'])
    }
  }

  createNewValuation() {
    this.isActiveValuationsVisible = false
    this.router.navigate(['valuations/detail/', 0, 'edit'], {
      queryParams: {
        propertyId: this.propertyId,
        isNewValuation: true
      }
    })
  }

  routeToValuationList() {
    this.messageService.add({
      severity: 'success',
      summary: 'Valuation cancelled',
      closable: false
    })
    this._valuationFacadeSvc.doValuationSearchBs.next(true)
    this.router.navigate(['/valuations'])
  }

  private getValuationPropertyInfo(propertyId: number) {
    this._valuationFacadeSvc.getValuationPropertyInfo(propertyId).subscribe((res) => {
      if (res) {
        this.displayValuationPropInfo(res)
      }
    })
  }

  private subscribeToNewPropertyStream() {
    this.propertyService.newPropertyAdded$.pipe(takeUntil(this.ngUnsubscribe)).subscribe((newProperty) => {
      if (newProperty && newProperty.propertyId != this.property?.propertyId) {
        this.property = newProperty
        this.showProperty = false
        this.valuationForm.get('property').setValue(this.property)
        console.log('WIP: call to getPropertyInformation 1881')
        this.getPropertyInformation(newProperty.propertyId)
        // this.getContactGroup(newProperty.lastKnownOwner?.contactGroupId);
        this.getSelectedOwner(newProperty.lastKnownOwner)
      }
    })
  }

  onLettingsValuerChange(valuer: BaseStaffMember) {
    this.lettingsValuer = valuer
  }

  onSalesValuerChange(valuer: BaseStaffMember) {
    this.salesValuer = valuer
  }

  getAvailability() {
    this.isAppointmentVisible = true
    this.sideBarControlVisible = true
    this.isSplitAppointment = false
    this.thisWeek = []
    this.nextTwoWeek = []
    this.nextWeek = []
    this.oldClass = 'null'

    this.availabilityForm.patchValue({
      fromDate: new Date(),
      lettingsValuerId: this.lettingsValuerControl.value ? this.lettingsValuerControl.value.staffMemberId : '',
      salesValuerId: this.salesValuerControl.value ? this.salesValuerControl.value.staffMemberId : '',
      type: this.isLettingsEdit ? 'lettings' : this.isSalesEdit ? 'sales' : 'both'
    })
  }

  searchAvailability() {
    this.sharedService.logValidationErrors(this.availabilityForm, true)

    if (this.availabilityForm.invalid) {
      return
    }

    this.isSplitAppointment = false
    const availability = { ...this.availabilityForm.value }

    const request = {
      fromDate: format(availability.fromDate, 'yyyy-MM-dd'),
      salesValuerId:
        (this.isBothEdit || this.isSalesEdit == true) && !this.isLettingsOnly ? availability.salesValuerId : null,
      lettingsValuerId:
        (this.isBothEdit || this.isLettingsEdit == true) && !this.isSalesOnly ? availability.lettingsValuerId : null
    } as ValuersAvailabilityOption

    if (this.isSalesAndLettings && availability.salesValuerId != availability.lettingsValuerId) {
      this.selectedStaffMemberId = availability.salesValuerId
      this.secondStaffMemberId = availability.lettingsValuerId
    } else {
      this.selectedStaffMemberId = this.isSalesOnly ? availability.salesValuerId : availability.lettingsValuerId
      this.secondStaffMemberId = null
      this.baseCalendarClass = this.isSalesOnly ? 'salesEvent' : 'lettingsEvent'
    }

    this.salesValuerOpenSlots = { thisWeek: [], nextWeek: [], next2Weeks: [] }
    this.lettingsValuerOpenSlots = {
      thisWeek: [],
      nextWeek: [],
      next2Weeks: []
    }

    this.getAvailableSlots(request)
    this.sideBarControlVisible = false
  }

  async getAvailableSlots(request) {
    await this._valuationFacadeSvc.getValuersCalendarAvailability(request).subscribe((x) => {
      if (x.length > 0) this.thisWeek = x[0].days
      if (x.length > 1) this.nextWeek = x[1].days
      if (x.length > 2) this.nextTwoWeek = x[2].days
      this.setWeeks()
      this.setFirstFreeSlot()
    })
  }

  setFirstFreeSlot() {
    let indexOf = this.thisWeek && this.thisWeek.findIndex((x) => !x.hours.class)
    let firstAvailableSlot
    if (indexOf > -1) {
      firstAvailableSlot = this.thisWeek[indexOf]
    } else {
      indexOf = this.nextWeek && this.nextWeek.findIndex((x) => !x.hours.class)
      if (indexOf > -1) {
        firstAvailableSlot = this.nextWeek[indexOf]
      } else {
        firstAvailableSlot = this.nextTwoWeek[0]
      }
    }
    this.selectedCalendarDate = new Date(firstAvailableSlot.date)
    this.showCalendar = true
    this.selectAvailableDate(firstAvailableSlot.hours[0])
  }

  setWeeks() {
    if (this.thisWeek) {
      this.setWeekData(this.thisWeek)
    }
    if (this.nextWeek) {
      this.setWeekData(this.nextWeek)
    }
    if (this.nextTwoWeek) {
      this.setWeekData(this.nextTwoWeek)
    }
  }

  removeSelectedClass(data: any[], oldClass: string) {
    let hourIndex = -1
    if (data && data.length > 0) {
      for (let i in data) {
        if (data[i].hours.findIndex((y) => y.class == 'hourColorsForSelected') > -1) {
          hourIndex = data[i].hours.findIndex((y) => y.class == 'hourColorsForSelected')
          data[i].hours[hourIndex].class = oldClass
        }
      }
    }
  }

  setWeekData(allData: any[]) {
    allData.forEach((x) => {
      if (x.hours) {
        x.hours.forEach((hour) => {
          if (hour['isFirstAvailable'] == false && hour['isSecondAvailable'] == false) {
            if (
              this.availabilityForm.controls['salesValuerId'].value !=
              this.availabilityForm.controls['lettingsValuerId'].value
            )
              hour.class = 'hourColorsForBoth'
            else hour.class = 'hourColorsForLettings'
          } else if (hour['isSecondAvailable'] === false) {
            hour.class = 'hourColorsForLettings'
          } else if (hour['isFirstAvailable'] === false) {
            hour.class = 'hourColorsForSales'
          }
        })
      }
    })
  }

  /*    let weekData
    let hours: any[] = []
    let newData = []
    if (allData && allData.length > 0) {
      weekData = this.sharedService.groupByDate(allData)
      // console.log(weekData);
      for (let key in weekData) {
        hours = []
        let defaultHours = [...this.defaultHours]
        let date: Date = new Date(weekData[key][0])
        if (date.getDay() == 6 || date.getDay() == 0) {
          defaultHours = [...this.defaultHoursForWeekend]
        }
        for (let d in defaultHours) {
          let slotDate = new Date(date.setHours(defaultHours[d]))
          if (date > new Date()) {
            hours.push({
              value: slotDate,
              class:
                this.isLettingsEdit || this.isLettingsOnly
                  ? 'hourColorsForLettings'
                  : this.isSalesEdit || this.isSalesOnly
                  ? 'hourColorsForSales'
                  : 'hourColorsForBoth'
            })
          }
        }

        for (let i = 0; i < hours.length; i++) {
          let index = weekData[key].findIndex((x) => x.getHours() == hours[i].value.getHours())

          if (index > -1) {
            hours[i] = {
              value: hours[i].value,
              class: ''
            }
          } else {
            let lettingIndex = this.findIndexSlot(hours[i].value, this.lettingsValuerOpenSlots)
            let salesIndex = this.findIndexSlot(hours[i].value, this.salesValuerOpenSlots)
            if (lettingIndex == -1 && salesIndex > -1) {
              hours[i] = {
                value: hours[i].value,
                class: 'hourColorsForLettings'
              }
            } else if (lettingIndex > -1 && salesIndex == -1) {
              hours[i] = {
                value: hours[i].value,
                class: 'hourColorsForSales'
              }
            }
          }
        }

        if (key)
          newData.push({
            date: weekData[key][0],
            hours: [...hours]
          })
      }
    }*/

  findIndexSlot(date: Date, slots: ValuationStaffMembersCalanderEvents): number {
    let index = -1
    if (slots.thisWeek && slots.thisWeek.findIndex((x) => new Date(x).getTime() === date.getTime()) > -1) {
      index = slots.thisWeek.findIndex((x) => new Date(x).getTime() === date.getTime())
      return index
    }
    if (slots.nextWeek && slots.nextWeek.findIndex((x) => new Date(x).getTime() === date.getTime()) > -1) {
      index = slots.nextWeek.findIndex((x) => new Date(x).getTime() === date.getTime())
      return index
    }
    if (slots.next2Weeks && slots.next2Weeks.findIndex((x) => new Date(x).getTime() === date.getTime()) > -1) {
      index = slots.next2Weeks.findIndex((x) => new Date(x).getTime() === date.getTime())
      return index
    }
    return index
  }

  selectAvailableDate(hours) {
    if (hours) {
      this.selectedDate = new Date(hours.clock)
      this.selectCalendarDate(this.selectedDate)
      this.isAvailabilityRequired = false

      this.removeSelectedClass(this.thisWeek, this.oldClass)
      this.removeSelectedClass(this.nextWeek, this.oldClass)
      this.removeSelectedClass(this.nextTwoWeek, this.oldClass)
      this.oldClass = hours.class
      hours.class = 'hourColorsForSelected'
    }
  }

  onPropertyType(value) {
    if (this.allPropertyStyles)
      this.propertyStyles = this.allPropertyStyles.filter((x) => x.id == 0 || x.parentId == value)

    if (value == PropertyType.House) {
      this.valuationForm.controls['propertyFloorId'].setValue(null)
    }
  }

  setCloseState() {
    this.showCalendar = false
    this.isAppointmentVisible = false
    this.sideBarControlVisible = false
    this.canBookAppointment = false
    this.isSalesEdit = false
    this.isLettingsEdit = false
    this.isBothEdit = false
    this.oldClass = 'null'
  }

  hideAppointmentDialog() {
    this.scrollSpecificElement('appointmentTab')
  }

  selectCalendarDate(date: Date) {
    this.selectedCalendarDate = new Date(date)
    this.showCalendar = true
  }

  getStaff(members: BaseStaffMember[]) {
    if (members && members.length > 5) {
      return _.take(members, 5)
    }
    return members
  }

  // showValuersList() {
  //   this.showOnlyMainStaffMember = !this.showOnlyMainStaffMember;
  //   if (this.property) {
  //     const propId = this.property.propertyId;
  //     this.getValuers(propId);
  //   }
  // }

  private getValuers(propId: number) {
    if (this.valuers && !this.valuers.length) {
      this._valuationFacadeSvc
        .getValuers(propId)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe((data) => {
          this.allValuers = data
          this.setValuersForSalesAndLettings()
          this.addInactiveValuers()
        })
    }
  }

  // add inactive users for display purposes only.
  addInactiveValuers() {
    const val = this.valuation
    if (this.allValuers && val) {
      if (val.salesValuer && this.allValuers.sales && this.allValuers.sales.length) {
        const index = this.allValuers.sales
          .flatMap((x) => x.staffMembers)
          .findIndex((s) => s.staffMemberId === val.salesValuer?.staffMemberId)
        if (index < 0) {
          this.allValuers.sales[0].staffMembers.push(val.salesValuer)
          this.availabilityForm.get('salesValuerId').setValue(val.salesValuer.staffMemberId)
          this.canBookAppointment = false
        }
      }

      if (val.lettingsValuer && this.allValuers.lettings && this.allValuers.lettings.length) {
        const allLettingsValuers = this.allValuers.lettings.flatMap((x) => x.staffMembers)
        const index = allLettingsValuers.findIndex((s) => s.staffMemberId === val.lettingsValuer?.staffMemberId)
        if (index < 0) {
          this.allValuers.lettings[0].staffMembers.push(val.lettingsValuer)
          this.availabilityForm.get('lettingsValuerId').setValue(val.lettingsValuer.staffMemberId)
          this.canBookAppointment = false
        }
      }
    }
  }

  onTenureChange(tenureId: number) {
    if (+tenureId === 3 || +tenureId === 2) {
      this.showLeaseExpiryDate = true
      this.approxLeaseExpiryDateControl.setValidators([Validators.max(999), Validators.min(1)])
      this.approxLeaseExpiryDateControl.updateValueAndValidity()
    } else {
      this.showLeaseExpiryDate = false
      this.approxLeaseExpiryDateControl.clearValidators()
      this.approxLeaseExpiryDateControl.updateValueAndValidity()
    }
  }

  createNewSigner() {
    this.valuationForm.markAsPristine()
  }

  createNewLastKnownOwner() {
    this.isLastKnownOwnerVisible = false
    this.valuationForm.markAsPristine()
  }

  createNewProperty(isNewProperty: boolean) {
    this.valuationForm.markAsPristine()
  }

  showPhotosModal() {
    this.showPhotos = true
  }

  showMapModal() {
    this.showMap = true
  }

  hidePhotosModal() {
    this.showPhotos = false
  }

  changeProperty() {
    this.showProperty = true
  }

  showPropertyModal() {
    this.showProperty = true
  }

  toggleAccordion(value: number) {
    let status = this.statuses.find((x) => x.value == value)
    if (status) {
      if (status.value == 0) {
        this.activeState[0] = true
        this.scrollSpecificElement('valuationNotesTab')
      } else if (status.value == 1) {
        this.activeState[0] = true
        this.activeState[1] = true
        this.scrollSpecificElement('propertyInfoTab')
      } else if (status.value == 2) {
        this.activeState[1] = true
        this.activeState[2] = true
        this.scrollSpecificElement('appointmentTab')
      } else if (status.value == 3) {
        this.activeState[2] = true
        this.activeState[3] = true
        this.scrollSpecificElement('valuesTab')
      } else if (status.value == 4) {
        this.activeState[4] = true
        this.scrollSpecificElement('termsOfBusinessTab')
      } else if (status.value == 6) {
        this.activeState[5] = true
        this.scrollSpecificElement('landRegisterTab')
      } else if (status.value == 9) {
        this.activeState[6] = true
        this.scrollSpecificElement('complianceChecksTab')
      }
    }
  }

  isTermsOfBusinessSigned(tob) {
    const signedOn =
      tob && tob.toBLetting && tob.toBLetting.signedOn
        ? true
        : tob && tob.toBSale && tob.toBSale.signedOn
        ? true
        : false
    return signedOn
  }

  public startInstruction() {
    const declarableInterst = this._valuationFacadeSvc._valuationData.getValue().declarableInterest
    if (typeof declarableInterst === undefined) {
      this.accordionIndex = 4
      this.activeState[4] = true
      this.messageService.add({
        severity: 'warn',
        summary: 'Declarable interest in Terms of Business section requires an answer',
        closable: false
      })
      return
    }

    const tob = this._valuationFacadeSvc._valuationData.getValue().eSignSignatureTob
    if (!this.isTermsOfBusinessSigned(tob)) {
      this.accordionIndex = 4
      this.activeState[4] = true
      this.messageService.add({
        severity: 'warn',
        summary: 'Terms of business is not signed',
        closable: false
      })
      return
    }

    const cc = this._valuationFacadeSvc._valuationData.getValue().complianceCheck
    if (!cc.compliancePassedDate) {
      this.accordionIndex = 9
      this.activeState[9] = true
      this.messageService.add({
        severity: 'warn',
        summary: `Compliance checks haven't passed yet!`,
        closable: false
      })
      return
    }

    if (!this._valuationFacadeSvc.landRegisterValid.getValue()) {
      this.accordionIndex = 5
      this.activeState[5] = true
      this.messageService.add({
        severity: 'warn',
        summary: `Please complete land registration!`,
        closable: false
      })
      return
    }

    this.propertyService
      .getPropertyInstructions(this.propertyId, true)
      .toPromise()
      .then((data) => {
        if (data && data.length > 0) {
          if (
            this.valuation.valuationType === ValuationTypeEnum.Sales &&
            data.findIndex((x) => x.type.toLocaleLowerCase() == 'sales') > -1
          ) {
            this.hasLiveInstruct = true
            this.instructionTypeMessage = 'sales instruction'
          } else if (
            this.valuation.valuationType === ValuationTypeEnum.Lettings &&
            data.findIndex((x) => x.type.toLocaleLowerCase() == 'lettings') > -1
          ) {
            this.instructionTypeMessage = 'lettings instruction'
            this.hasLiveInstruct = true
            if (
              data.filter((x) => x.status == 'UO' || x.status == 'EXCH' || x.status == 'LET').length ==
              data.filter((x) => x.type.toLocaleLowerCase() == 'lettings').length
            ) {
              this.liveInstructWarning = true
              this.liveInstructHeader = 'Warning'
            } else {
              this.liveInstructWarning = false
            }
          } else {
            this.openInstructionForm()
          }
        } else {
          this.openInstructionForm()
        }
      })
  }

  openInstructionForm() {
    this.hasLiveInstruct = false
    let val: Valuation
    val = { ...this.valuation, ...this.valuationForm.value }

    const tob = this._valuationFacadeSvc._valuationData.getValue().eSignSignatureTob

    const instruction = {
      valuationEventId: val.valuationEventId,
      salesAgencyType: '',
      lettingsAgencyType: '',
      askingPrice: tob?.toBSale?.instructionPriceDirection,
      askingRentShortLet: val.suggestedAskingRentShortLet,
      askingRentLongLet: val.suggestedAskingRentLongLet,
      askingRentShortLetMonthly: val.suggestedAskingRentShortLetMonthly,
      askingRentLongLetMonthly: val.suggestedAskingRentLongLetMonthly
    } as Instruction
    this.instruction = instruction
    this.isInstructVisible = true
    this.populateInstructionForm(instruction)
    this.setInstructionFlags(instruction)
  }

  goInstruction() {
    this.openInstructionForm()
  }

  setInstructionFlags(instruction: Instruction) {
    if (instruction.askingPrice && !instruction.askingRentLongLet) {
      this.instructionForm.get('instructSale').setValue(true)
      this.showInstruct = false
    } else if (!instruction.askingPrice && instruction.askingRentLongLet) {
      this.instructionForm.get('instructLet').setValue(true)
      this.showInstruct = false
    } else {
      this.showInstruct = true
    }
  }

  onInstructLettingsChange(event) {
    if (this.instructionForm.get('instructLet').value == false) {
      this.formErrors.lettingsAgencyType = null
      this.instructionForm.patchValue(
        {
          isInstructLongLet: false,
          isInstructShortLet: false
        },
        { emitEvent: false }
      )
    }
  }

  setInstructionFormValidators() {
    this.setAskingPriceValidator()
    this.setRentValidators()
  }

  setAgencyTypeValidator() {
    if (this.instructSaleControl.value) {
      this.setSalesAgencyTypeValidator()
    }
    if (this.instructLetControl.value) {
      this.setLettingsAgencyTypeValidator()
    }
  }

  setValuersValidators() {
    this.setSalesValuerValidator()
    this.setLettingsValuerValidator()
  }

  setLettingsValuerValidator() {
    if ((this.isLettingsOnly || this.isSalesAndLettings) && !this.lettingsValuerIdControl.value) {
      this.lettingsValuerIdControl.setValidators(Validators.required)
      this.lettingsValuerIdControl.updateValueAndValidity()
    } else {
      this.lettingsValuerIdControl.clearValidators()
      this.lettingsValuerIdControl.updateValueAndValidity()
    }
  }

  private setSalesValuerValidator() {
    if ((this.isSalesOnly || this.isSalesAndLettings) && !this.salesValuerIdControl.value) {
      this.salesValuerIdControl.setValidators(Validators.required)
      this.salesValuerIdControl.updateValueAndValidity()
    } else {
      this.salesValuerIdControl.clearValidators()
      this.salesValuerIdControl.updateValueAndValidity()
    }
  }

  private setAskingPriceValidator() {
    if (this.instructionForm.get('instructSale').value && !this.instAskingPriceControl.value) {
      this.instAskingPriceControl.setValidators([Validators.required, Validators.min(1)])
      this.instAskingPriceControl.updateValueAndValidity()
    } else {
      this.instAskingPriceControl.clearValidators()
      this.instAskingPriceControl.updateValueAndValidity()
    }
  }

  private setLongLetRentValidator() {
    if (!this.instLongLetWeeklyControl.value && !this.instShortLetWeeklyControl.value) {
      this.instLongLetWeeklyControl.setValidators([Validators.required, Validators.min(1)])
      this.instLongLetWeeklyControl.updateValueAndValidity()
    } else {
      this.instLongLetWeeklyControl.clearValidators()
      this.instLongLetWeeklyControl.updateValueAndValidity()
    }
  }

  private setShortLetRentValidator() {
    if (!this.instShortLetWeeklyControl.value && !this.longLetWeeklyControl.value) {
      this.instShortLetWeeklyControl.setValidators(Validators.required)
      this.instShortLetWeeklyControl.updateValueAndValidity()
    } else {
      this.instShortLetWeeklyControl.clearValidators()
      this.instShortLetWeeklyControl.updateValueAndValidity()
    }
  }

  setRentValidators() {
    if (this.instructionForm.get('instructLet').value) {
      switch (true) {
        case !this.instLongLetWeeklyControl.value:
          this.setLongLetRentValidator()
          break
        case !this.shortLetWeeklyControl.value:
          this.setShortLetRentValidator()
          break
      }
    }
  }

  private setSalesAgencyTypeValidator() {
    const salesAgencyControl = this.instructionForm.get('salesAgencyType')

    if (this.instructSaleControl) {
      salesAgencyControl.setValidators(Validators.required)
      salesAgencyControl.updateValueAndValidity()
    } else {
      salesAgencyControl.clearValidators()
      salesAgencyControl.updateValueAndValidity()
    }
  }

  private setLettingsAgencyTypeValidator() {
    const lettingsAgencyControl = this.instructionForm.get('lettingsAgencyType')

    if (this.instructLetControl) {
      lettingsAgencyControl.setValidators(Validators.required)
      lettingsAgencyControl.updateValueAndValidity()
    } else {
      lettingsAgencyControl.clearValidators()
      lettingsAgencyControl.updateValueAndValidity()
    }
  }

  saveInstruction() {
    this.setAgencyTypeValidator()
    this.setInstructionFormValidators()

    this.sharedService.logValidationErrors(this.instructionForm, true)
    const instructionSelected =
      this.instructionForm.get('instructSale').value || this.instructionForm.get('instructLet').value
    if (this.instructionForm.valid) {
      if (this.instructionForm.dirty && instructionSelected) {
        this.isSubmitting = true
        const instruction = {
          ...this.instruction,
          ...this.instructionForm.value
        } as Instruction
        this.setInstructionValue(instruction)
        this._valuationFacadeSvc.addInstruction(instruction).subscribe(
          (result: ResultData) => {
            this.onInstructionSaveComplete(result.status)
          },
          (error: WedgeError) => {
            this.isSubmitting = false
          }
        )
      } else {
        this.onInstructionSaveComplete()
      }
    } else {
      Object.keys(this.instructionForm.controls).forEach((key: string) => {
        const control = this.instructionForm.get(key)
        if (control.invalid)
          this.messageService.add({
            severity: 'warn',
            summary: 'You must enter ' + key + ' value',
            closable: false
          })
      })
    }
  }

  setInstructionValue(instruction: Instruction) {
    const isSale = this.instructionForm.get('instructSale').value
    const isLet = this.instructionForm.get('instructLet').value
    instruction.askingPrice = 0
    instruction.askingRentShortLet = 0
    instruction.askingRentLongLet = 0
    instruction.askingRentShortLetMonthly = 0
    instruction.askingRentLongLetMonthly = 0

    if (isSale) {
      instruction.askingPrice = this.sharedService.convertStringToNumber(this.instAskingPriceControl.value)
    }
    if (isLet) {
      instruction.askingRentLongLet = this.sharedService.convertStringToNumber(this.instLongLetWeeklyControl.value)
      instruction.askingRentLongLetMonthly = this.sharedService.convertStringToNumber(
        this.instLongLetMonthlyControl.value
      )
      instruction.askingRentShortLet = this.sharedService.convertStringToNumber(this.instShortLetWeeklyControl.value)
      instruction.askingRentShortLetMonthly = this.sharedService.convertStringToNumber(
        this.instShortLetMonthlyControl.value
      )
    }
  }

  checkAvailabilityBooking() {
    if ((this.isNewValuation || this.isEditable) && !this.valuationForm.get('valuationDate').value) {
      this.isAvailabilityRequired = false
      if (
        this.isSalesAndLettings &&
        !this.valuation?.lettingsValuationBooking?.startDateTime &&
        !this.valuation?.salesValuationBooking?.startDateTime
      ) {
        this.isAvailabilityRequired = true
      }
      if (this.isSalesOnly && !this.valuation?.salesValuationBooking?.startDateTime) {
        this.isAvailabilityRequired = true
        this.isSalesAndLettings = false
        this.isLettingsOnly = false
      }
      if (this.isLettingsOnly && !this.valuation?.lettingsValuationBooking?.startDateTime) {
        this.isAvailabilityRequired = true
        this.isSalesOnly = false
        this.isSalesAndLettings = false
      }
    }
  }

  checkOriginBookedBy(): boolean {
    if (
      (this.valuation.originTypeId == 13 || this.valuation.originTypeId == 14) &&
      !(this.valuation.bookedById && this.valuation.bookedById > 0)
    )
      return false

    return true
  }

  saveValuation() {
    console.log('save valuation start')
    this.checkAvailabilityBooking()
    this.setValuersValidators()

    const validForSave = this.validateValuationForSave()
    if (validForSave) {
      console.log('valid for save - continuing...')
      this.addOrUpdateValuation()
    } else {
      console.log('invalid, not saving')
      return
    }
  }

  private validateValuationForSave() {
    if (!this.checkOriginBookedBy() || !(this.valuation.originId > 0)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You must complete origin information!',
        closable: false
      })
      return false
    }

    if (!this.lastKnownOwner) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You must add a last owner to the property!',
        closable: false
      })
      return false
    }

    let isThereAPrice = this.isThereAPrice(this.valuationForm.value)

    if (this.areValuesVisible && isThereAPrice && this.valuationForm.get('valuationNote').value) {
      this.valuationForm.get('valuationNote').setValidators(null)
    }

    if (
      (this.valuation.valuationStatus == ValuationStatusEnum.Booked ||
        (this.valuation.valuationStatus == ValuationStatusEnum.Valued && this.isEditValueActive)) &&
      isThereAPrice &&
      this.isStillInOneMonthPeriod === false
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: `You can't price a valuation after 1 month! TODO fix validation (add lockDate to valuation)`,
        closable: false
      })
      // return false
    }

    if (
      (this.valuation.valuationStatus == ValuationStatusEnum.Booked ||
        (this.valuation.valuationStatus == ValuationStatusEnum.Valued && this.isEditValueActive)) &&
      isThereAPrice &&
      this.isAllowedForValueChanges === false
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: `You don't have permissions to price valuations!`,
        closable: false
      })
      return false
    }

    if (this.valuationForm.controls['propertyTypeId'].value === 0)
      this.valuationForm.controls['propertyTypeId'].setValue(null)

    if (this.valuationForm.controls['propertyStyleId'].value === 0)
      this.valuationForm.controls['propertyStyleId'].setValue(null)

    this.sharedService.logValidationErrors(this.valuationForm, true)

    // validation of land register
    //this._valuationFacadeSvc.valuationValidationSubject.next(true);

    const declarableInterest = this._valuationFacadeSvc._valuationData.getValue().declarableInterest
    if (declarableInterest == null || typeof declarableInterest == 'undefined') {
      this.messageService.add({
        severity: 'warn',
        summary: 'Please complete declarable interest',
        closable: false
      })
      this.accordionIndex = 4
      this.activeState[4] = true
      return false
    }

    if (this.isAvailabilityRequired) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You must make valuation appointments',
        closable: false
      })
      return false
    }

    if (
      !(
        this.valuationForm.controls['salesMeetingOwner'].value != null ||
        this.valuationForm.controls['lettingsMeetingOwner'].value != null
      )
    ) {
      this.messageService.add({
        severity: 'warn',
        summary: 'You must select who we are meeting options',
        closable: false
      })
      return false
    }

    if (this.valuationForm.valid) {
      return true
    } else {
      this.errorMessage = {} as WedgeError
      this.errorMessage.displayMessage = 'Please correct validation errors'
      console.log('form is invalid...')
    }
  }

  getInfoIdArray(infoArray: InfoDetail[]): number[] {
    let idArray: number[] = []
    if (infoArray && infoArray.length > 0) {
      infoArray.map((element) => {
        idArray.push(element.id)
        return idArray
      })
    }
    return idArray
  }

  private gatherValuationPropsFromViewReadyForSaving() {
    this.isSubmitting = true

    let valuationValue = this._valuationFacadeSvc._valuationData.getValue() // grabs current value of valuation Observable since it may have been updated by compliance store (personDocuments || companyDocuments)
    const valuation = { ...valuationValue, ...this.valuationForm.value }
    valuation.propertyOwner = this.lastKnownOwner
    valuation.OfficeId = this.property.officeId
    valuation.approxLeaseExpiryDate = this.approxLeaseExpiryDate
    valuation.originId = this.valuation.originId
    valuation.bookedBy = this.valuation.bookedBy
    valuation.bookedById = this.valuation.bookedBy ? this.valuation.bookedBy.staffMemberId : this.valuation.bookedById
    valuation.eSignSignatureTob = valuationValue.eSignSignatureTob ? valuationValue.eSignSignatureTob : {}
    valuation.isPowerOfAttorney =
      this.adminContact && this.adminContact.contactGroupId > 0 ? this.adminContact?.isPowerOfAttorney : false
    valuation.ccOwner = this.adminContact && this.adminContact.contactGroupId > 0 ? this.adminContact?.ccOwner : false

    valuation.valuationContactNote = {
      ...this.valuation.valuationContactNote
    }
    let text = this.valuationForm.controls['valuationNote'].value
    if (text) valuation.valuationContactNote.text = text

    valuation.suggestedAskingRentShortLetMonthly = this.sharedService.convertStringToNumber(
      valuation.suggestedAskingRentShortLetMonthly
    )

    valuation.property = this.valuation.property || {} // error when creating new property as valuation.property is undefined.

    if (!this.valuationForm.get('propertyTypeId').value) return

    valuation.property.propertyTypeId = +this.valuationForm.get('propertyTypeId').value
    valuation.property.propertyStyleId = +this.valuationForm.get('propertyStyleId').value
    valuation.property.propertyFloorId = this.valuationForm.get('propertyFloorId').value
    valuation.property.floorOther = this.valuationForm.get('floorOther').value
    valuation.otherFeatures = []
    valuation.propertyFeature = []

    if (this.showLeaseExpiryDate == false) {
      valuation.leaseLandReg = {}
    }

    if (this.valuationForm.get('isNewBuild').value) valuation.otherFeatures.push(OtherFeatures.New_Build)
    if (this.valuationForm.get('isRetirementHome').value) valuation.otherFeatures.push(OtherFeatures.Retirement_Home)
    if (this.valuationForm.get('hasDisabledAccess').value)
      valuation.propertyFeature.push(PropertyFeatures.Disabled_Access)

    valuation.suggestedAskingRentLongLetMonthly =
      typeof valuation.suggestedAskingRentLongLetMonthly === 'string'
        ? this.sharedService.convertStringToNumber(valuation.suggestedAskingRentLongLetMonthly)
        : valuation.suggestedAskingRentLongLetMonthly
    valuation.suggestedAskingPrice =
      typeof valuation.suggestedAskingPrice === 'string'
        ? this.sharedService.convertStringToNumber(valuation.suggestedAskingPrice)
        : valuation.suggestedAskingPrice
    valuation.suggestedAskingRentShortLet =
      typeof valuation.suggestedAskingRentShortLet === 'string'
        ? this.sharedService.convertStringToNumber(valuation.suggestedAskingRentShortLet)
        : valuation.suggestedAskingRentShortLet
    valuation.suggestedAskingRentLongLet =
      typeof valuation.suggestedAskingRentLongLet === 'string'
        ? this.sharedService.convertStringToNumber(valuation.suggestedAskingRentLongLet)
        : valuation.suggestedAskingRentLongLet

    this.checkValuers(valuation)
    if (this.approxLeaseExpiryDate) {
      valuation.approxLeaseExpiryDate = this.approxLeaseExpiryDate
    }
    if (this.valuationForm.get('sqFt').value === 'Not Known') {
      valuation.sqFt = 0
    }

    valuation.parking = this.getInfoIdArray(this.valuationForm.get('parking').value)
    valuation.outsideSpace = this.getInfoIdArray(this.valuationForm.get('outsideSpace').value)

    this.setValuers(valuation)
    return valuation
  }

  addOrUpdateValuation() {
    this.setLeaseExpiryDate()
    const valuation = this.gatherValuationPropsFromViewReadyForSaving()
    console.log('valuation about to be saved: ', valuation)
    if (this.isNewValuation) {
      this.saveValuationSubscription = this._valuationFacadeSvc.addValuation(valuation).subscribe(
        (data) => {
          if (data) {
            this.onSaveComplete(data)
          }
        },
        (error: WedgeError) => {
          this.messageService.add({
            severity: 'error',
            summary: error.displayMessage,
            closable: false
          })
          this.isSubmitting = false
        }
      )
    } else {
      this.saveValuationSubscription = this._valuationFacadeSvc.updateValuation(valuation).subscribe(
        (data) => {
          if (data) {
            this.onSaveComplete(data)
          }
        },
        (error: WedgeError) => {
          this.errorMessage = error
          this.isSubmitting = false
        }
      )
    }
  }

  getDuration(totalHours: number) {
    let duration = ''
    if (totalHours >= 1) {
      duration = `${totalHours} hours`
    } else {
      const minutes = Math.floor(totalHours * 60)
      duration = `${minutes} minutes`
    }
    return duration
  }

  isWeekdays(date: Date): boolean {
    return date.getDay() !== 0 && date.getDay() !== 6
  }

  is15Minutes(date: Date): boolean {
    const minutes = date.getMinutes()
    return minutes === 15
  }

  setValuers(valuation) {
    if (valuation.salesValuationBooking?.startDateTime == valuation.lettingsValuationBooking?.startDateTime) {
      valuation.combinedValuationBooking = {
        name: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateName : '',
        emailAddress: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateEmail : '',
        contactNumber: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateContactNumber : '',
        associationId: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateType : '',
        meetingOwner: valuation.salesMeetingOwner,
        startDateTime: valuation.salesValuationBooking?.startDateTime,
        totalHours:
          this.isWeekdays(new Date(valuation.salesValuationBooking?.startDateTime)) &&
          this.is15Minutes(new Date(valuation.salesValuationBooking?.startDateTime))
            ? 0.75
            : 1
      }
      valuation.combinedValuationBooking.meetingOwner = valuation.salesMeetingOwner == false ? false : true
      valuation.lettingsValuationBooking = null
      valuation.salesValuationBooking = null
    } else {
      valuation.combinedValuationBooking = null
      if (valuation.salesValuationBooking) {
        valuation.salesValuationBooking = {
          name: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateName : '',
          emailAddress: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateEmail : '',
          contactNumber: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateContactNumber : '',
          associationId: valuation.salesMeetingOwner == false ? valuation.salesOwnerAssociateType : '',
          meetingOwner: valuation.salesMeetingOwner,
          startDateTime: valuation.salesValuationBooking?.startDateTime,
          totalHours:
            this.isWeekdays(new Date(valuation.salesValuationBooking?.startDateTime)) &&
            this.is15Minutes(new Date(valuation.salesValuationBooking?.startDateTime))
              ? 0.75
              : 1
        }
        valuation.salesValuationBooking.meetingOwner = valuation.salesMeetingOwner == false ? false : true
      }
      if (valuation.lettingsValuationBooking) {
        valuation.lettingsValuationBooking = {
          name: valuation.lettingsMeetingOwner == false ? valuation.lettingsOwnerAssociateName : '',
          emailAddress: valuation.lettingsMeetingOwner == false ? valuation.lettingsOwnerAssociateEmail : '',
          contactNumber: valuation.lettingsMeetingOwner == false ? valuation.lettingsOwnerAssociateContactNumber : '',
          associationId: valuation.lettingsMeetingOwner == false ? valuation.lettingsOwnerAssociateType : '',
          meetingOwner: valuation.lettingsMeetingOwner,
          startDateTime: valuation.lettingsValuationBooking?.startDateTime,
          totalHours:
            this.isWeekdays(new Date(valuation.lettingsValuationBooking?.startDateTime)) &&
            this.is15Minutes(new Date(valuation.lettingsValuationBooking?.startDateTime))
              ? 0.75
              : 1
        }
        valuation.lettingsValuationBooking.meetingOwner = valuation.lettingsMeetingOwner == false ? false : true
      }
    }
  }

  checkValuers(valuation: any) {
    switch (valuation.type) {
      case 'lettings':
        valuation.salesValuer = null
        break
      case 'sales':
        valuation.lettingsValuer = null
        break
    }
  }

  private setLeaseExpiryDate() {
    if (
      this.valuationForm.get('approxLeaseExpiryDate').value &&
      this.valuationForm.get('approxLeaseExpiryDate').value > 0
    ) {
      const leaseExpiryDateInYears = +this.valuationForm.get('approxLeaseExpiryDate').value
      this.approxLeaseExpiryDate = addYears(new Date(), leaseExpiryDateInYears)
    } else {
      this.approxLeaseExpiryDate = null
    }
  }

  private changeLeaseExpiryDateToYears(approxLeaseExpiryDate: any) {
    if (approxLeaseExpiryDate) {
      return differenceInCalendarYears(new Date(approxLeaseExpiryDate), new Date())
    }
  }

  duplicateValuation() {
    const propertyId = this.property.propertyId
    const lastKnownOwnerId = this.lastKnownOwner.contactGroupId
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() =>
      this.router.navigate(['valuations/detail/', 0, 'edit'], {
        queryParams: {
          propertyId: propertyId,
          lastKnownOwnerId: lastKnownOwnerId,
          isNewValuation: true
        }
      })
    )
  }

  onSaveComplete(valuation?: Valuation) {
    console.log('onSaveComplete: ', valuation)
    this.valuationForm.markAsPristine()
    this.isSubmitting = false
    this.errorMessage = null
    if (this.isNewValuation) {
      this.messageService.add({
        severity: 'success',
        summary: 'Valuation successfully saved',
        closable: false
      })
      this.sharedService.resetUrl(this.valuationId, valuation.valuationEventId)
    } else {
      this.messageService.add({
        severity: 'success',
        summary: 'Valuation successfully updated',
        closable: false
      })
    }

    // Why is the route reloaded here?
    // TODO: make necessary state changes on client to not have to reload the page
    if (valuation && valuation.valuationEventId > 0)
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/valuations/detail', valuation.valuationEventId, 'edit']))
  }

  onInstructionSaveComplete(status?: boolean) {
    // const instructionEventId = instruction.salesInstructionEventId || instruction.lettingsInstructionEventId;
    this.instructionForm.markAsPristine()
    this.isSubmitting = false
    this.errorMessage = null
    if (status) {
      this.messageService.add({
        severity: 'success',
        summary: 'Instruction successfully saved',
        closable: false
      })
      this.router
        .navigateByUrl('/', { skipLocationChange: true })
        .then(() => this.router.navigate(['/valuations/detail', this.valuation.valuationEventId, 'instructed']))
    }
  }

  cancel() {
    this.sharedService.back()
  }

  cancelInstruction() {
    this.sharedService.resetForm(this.instructionForm)
  }

  cancelBooking() {
    this.isBothEdit = false
    this.sideBarControlVisible = false
    this.isLettingsOnly = false
    this.isSalesOnly = false
    this.sharedService.resetForm(this.availabilityForm)
    this.isAppointmentVisible = false
  }

  makeBooking() {
    if (this.isSplitAppointment == true) {
      if (!this.selectedSalesDate) {
        this.bookingButtonLabel = 'Book For Lettings'
        this.selectedSalesDate = this.selectedDate
        return
      } else {
        this.selectedLettingsDate = this.selectedDate
      }
    } else {
      if (this.isSalesAndLettings) {
        this.selectedLettingsDate = this.selectedDate
        this.selectedSalesDate = this.selectedDate
      } else if (this.isSalesOnly) {
        this.selectedSalesDate = this.selectedDate
      } else if (this.isLettingsOnly) {
        this.selectedLettingsDate = this.selectedDate
      }
    }

    this.oldClass = 'null'

    if (this.valuation && !this.valuation.valuationDate) {
      this.valuation.valuationDate = this.selectedSalesDate
    }
    this.valuationForm.controls['valuationDate'].setValue(this.selectedSalesDate)
    if (this.salesValuer && (this.isSalesOnly || this.isSalesAndLettings)) {
      this.valuation.salesValuationBooking = {
        startDateTime: this.selectedSalesDate,
        totalHours:
          this.isWeekdays(new Date(this.selectedSalesDate)) && this.is15Minutes(new Date(this.selectedSalesDate))
            ? 0.75
            : 1
      }
      this.salesValuerControl.setValue(this.salesValuer)
      this.salesValuerControl.updateValueAndValidity()
    }
    if (this.lettingsValuer && (this.isLettingsOnly || this.isSalesAndLettings)) {
      this.valuation.lettingsValuationBooking = {
        startDateTime: this.selectedLettingsDate,
        totalHours:
          this.isWeekdays(new Date(this.selectedLettingsDate)) && this.is15Minutes(new Date(this.selectedLettingsDate))
            ? 0.75
            : 1
      }
      this.lettingsValuerControl.setValue(this.lettingsValuer)
      this.lettingsValuerControl.updateValueAndValidity()
    }

    if (this.isBothEdit) {
      if (this.isSalesOnly) {
        {
          this.lettingsValuerControl.setValue(null)
          this.valuation.lettingsValuationBooking = null
          this.getTimeLettingsValuationDate = null
        }
      } else if (this.isLettingsOnly) {
        this.salesValuerControl.setValue(null)
        this.valuation.salesValuationBooking = null
        this.getTimeSalesValuationDate = null
      }
    }
    this.selectedLettingsDate = this.valuation.lettingsValuationBooking?.startDateTime
      ? new Date(this.valuation.lettingsValuationBooking?.startDateTime)
      : null
    this.selectedSalesDate = this.valuation.salesValuationBooking?.startDateTime
      ? new Date(this.valuation.salesValuationBooking?.startDateTime)
      : null

    this.getTimeSalesValuationDate = this.selectedSalesDate?.getTime()
    this.getTimeLettingsValuationDate = this.selectedLettingsDate?.getTime()

    this.valuationForm.controls['lettingsMeetingOwner'].setValue(null)
    this.valuationForm.controls['salesMeetingOwner'].setValue(null)

    this.setCloseState()

    this._valuationFacadeSvc.updateLocalValuation(this.valuation)
    this.valuationForm.markAsDirty()
  }

  canDeactivate(): boolean {
    if (!this.isCanDeactivate && this.valuationForm.dirty && !this.isSubmitting) {
      return false
    }
    return true
  }

  onUpdateToBForm(ev) {
    this._valuationFacadeSvc.updateLocalValuation(ev)
  }

  onSendTermsOfBusinessReminder() {
    this._valuationFacadeSvc.sendTermsOfBusinessReminder()
  }

  submitTermsOfBusiness(ev) {
    this._valuationFacadeSvc.termsOfBusinessFileUploaded(ev)
  }

  onPowerOfAttorneyChange(ev) {
    this._valuationFacadeSvc.togglePowerOfAttorney(ev)
  }

  onChangeLastKnownOwner(ev) {
    console.log('owner has changed, refresh documents in compliance checks', ev)
    this.sharedService.addLastOwnerBs.next(true)
    this.isLastKnownOwnerVisible = true
  }

  onRefreshDocuments() {
    console.log('refresh documents')
    this.isDisabledInstructButton = true
  }

  ngOnDestroy() {
    console.log('destroying valuation detail edit component 💣')
    this._valuationFacadeSvc._valuationData.next({})
    this.property = {} as Property
    this.sharedService.removeContactGroupChanged.next(null)
    this.sharedService.openContactGroupChanged.next(null)
    this.propertyService.setAddedProperty(null)
    this.sharedService.clearFormValidators(this.valuationForm, this.formErrors)
    this.storage.delete('valuationFormData').subscribe()
    this.openContactGroupSubscription.unsubscribe()
    this.removeContactGroupSubscription.unsubscribe()
    this.eSignSubscription.unsubscribe()
    this.cancelValuationSubscription.unsubscribe()
    this.propertySubscription.unsubscribe()
    this.contactGroupSubscription.unsubscribe()
    this.saveValuationSubscription.unsubscribe()
    this.isAllowedForValueChangesSubscription.unsubscribe()
    this.storage.delete(this.mainPersonId?.toString()).subscribe()
    this.destroy.unsubscribe()
  }
}
