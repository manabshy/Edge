import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DiaryEvent, DiaryEventTypesEnum, reminderUnitTypes } from '../shared/diary';
import { SharedService, WedgeError } from 'src/app/core/services/shared.service';
import { DiaryEventService } from '../shared/diary-event.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service';
import { getHours, getMinutes, format, setHours, setMinutes, isAfter } from 'date-fns';
import { Property } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseStaffMember } from 'src/app/shared/models/base-staff-member';
import { WedgeValidators } from 'src/app/shared/wedge-validators';
import { FormErrors } from 'src/app/core/shared/app-constants';
import { PropertyService } from 'src/app/property/shared/property.service';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { Subject } from 'rxjs';
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';
import { ResultData } from 'src/app/shared/result-data';
import * as _ from 'lodash';
@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent implements OnInit {
  eventTypes: InfoDetail[];
  diaryEventForm: FormGroup;
  isSubmitting: boolean;
  minutes = ['00', '15', '30', '45'];
  durationTypes = reminderUnitTypes;
  isNewEvent: boolean;
  diaryEvent: DiaryEvent;
  diaryEventId: number;
  isAllDay = false;
  isReminder = false;
  showProperties = false;
  showContacts = false;
  showStaffMembers = true;
  showOthers = false;
  maxDate = null;
  minDate = new Date();
  formErrors = FormErrors;
  propertyLabel = 'Properties';
  contactLabel = 'Contacts';
  eventTypesMap: Map<number, string>;
  property: Property;
  staffMemberIdList: number[] = [];
  graphEventId: string;
  staffMemberId: number;
  showTypes = true;
  isEditable = false;
  currentStaffMember: BaseStaffMember[];
  id: number;
  showAllEventTypes: InfoDetail[];
  showOnlyPropertyEventTypes: InfoDetail[];
  showOnlyContactEventTypes: InfoDetail[];
  NumberOfPeopleLabel: string;
  eventStaffMembers: BaseStaffMember[];
  showMorePeople = true;
  canRebook = false;
  isRebook: boolean;

  get hours() {
    const result = [];
    for (let hr = 0; hr < 24; hr++) {
      const hrStr = hr.toString().padStart(2, '0');
      result.push(hrStr);
    }
    return result;
  }

  get durationValues() {
    const result = [];
    for (let duration = 0; duration <= 60; duration++) {
      result.push(duration);
    }
    return result;
  }

  get startHourControl() {
    return this.diaryEventForm.get('startHour') as FormControl;
  }
  get endHourControl() {
    return this.diaryEventForm.get('endHour') as FormControl;
  }
  get startMinControl() {
    return this.diaryEventForm.get('startMin') as FormControl;
  }
  get endMinControl() {
    return this.diaryEventForm.get('endMin') as FormControl;
  }
  get startDateTimeControl() {
    return this.diaryEventForm.get('startDateTime') as FormControl;
  }
  get endDateTimeControl() {
    return this.diaryEventForm.get('endDateTime') as FormControl;
  }

  constructor(private fb: FormBuilder,
    private diaryEventService: DiaryEventService,
    private propertyService: PropertyService,
    private storage: StorageMap,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.diaryEventId = +this.route.snapshot.paramMap.get('id');
    this.graphEventId = this.route.snapshot.queryParamMap.get('graphEventId');
    this.staffMemberId = +this.route.snapshot.queryParamMap.get('staffMemberId');
    this.isNewEvent = this.route.snapshot.queryParamMap.get('isNewEvent') as unknown as boolean;
    this.setupForm();

    // Set current staff as the first member of staff members array.
    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = [{
          staffMemberId: data.staffMemberId,
          emailAddress: data.email,
          fullName: data.fullName
        }] as BaseStaffMember[];
        const currentStaffMemberId = [];
        this.id = this.staffMemberId || data.staffMemberId;
        currentStaffMemberId.push(this.id);
        this.staffMemberIdList = currentStaffMemberId;
      }
    });

    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      if (info) {
        const allEventTypes = info.diaryEventTypes;
        this.eventTypes = allEventTypes
          .filter(x => ![DiaryEventTypesEnum.ValuationSales, DiaryEventTypesEnum.ValuationLettings, DiaryEventTypesEnum.Alert].includes(x.id));

        // Group event into array of parts of the form visbile
        if (this.eventTypes && this.eventTypes.length) {
          this.showAllEventTypes = this.eventTypes.filter(x => [DiaryEventTypesEnum.ViewingSales, DiaryEventTypesEnum.ViewingLettings,
          DiaryEventTypesEnum.PropertyManagement, DiaryEventTypesEnum.Reminder, DiaryEventTypesEnum.Other].includes(x.id));
          this.showOnlyPropertyEventTypes = this.eventTypes
            .filter(x => [DiaryEventTypesEnum.PreviewSales, DiaryEventTypesEnum.PreviewLettings].includes(x.id));
          this.showOnlyContactEventTypes = this.eventTypes
            .filter(x => [DiaryEventTypesEnum.Meeting, DiaryEventTypesEnum.Interview, DiaryEventTypesEnum.Training].includes(x.id));
          // this.getDiaryEvent();
        }
      }
    });

    this.getDiaryEvent();
    this.getAddedProperty();
    this.diaryEventForm.valueChanges.subscribe(data => {
      this.sharedService.logValidationErrors(this.diaryEventForm, false);
    });
  }

  private getDiaryEvent() {
    if (this.diaryEventId || this.graphEventId || this.staffMemberId) {
      this.diaryEventService.getDiaryEventById(this.diaryEventId, this.graphEventId, this.staffMemberId)
        .subscribe(event => {
          if (event) {
            this.diaryEvent = event;
            if (event.onOutlook) {
              this.isEditable = false;
              !event.onEdge ? this.showTypes = false : this.showTypes = true;
              if (event.staffMembers && event.staffMembers.length) {
                this.eventStaffMembers = event.staffMembers;
                this.diaryEvent.staffMembers = this.getStaff(event.staffMembers);
                this.setPeopleLabel(this.eventStaffMembers);
              }
            } else {
              this.isEditable = true;
              this.setReminder(this.id, event.staffMembers, true);
            }
            this.rebookViewings(event);
            this.toggleFlags(+event.eventTypeId);
            this.setStaffMemberIdList(event.staffMembers);
            this.populateForm(event);
            console.log('event details', event);
          }
        });
    }
  }

  private rebookViewings(event: DiaryEvent) {
    if (+event.eventTypeId === DiaryEventTypesEnum.ViewingSales || +event.eventTypeId === DiaryEventTypesEnum.ViewingLettings) {
      event.properties && event.properties.length ? this.canRebook = true : this.canRebook = false;
    }
  }

  setPeopleLabel(staffMembers?: BaseStaffMember[]) {
    const difference = staffMembers?.length - 5;
    if (difference > 0) {
      if (difference === 1) {
        this.NumberOfPeopleLabel = difference + ' person';
      } else {
        this.NumberOfPeopleLabel = difference + ' people';
      }
    }
  }

  getStaff(members: BaseStaffMember[]) {
    if (members && members.length > 5) {
      return _.take(members, 5);
    }
    return members;
  }

  setStaffMemberIdList(staffMembers: BaseStaffMember[]) {
    const result = [];
    if (staffMembers && staffMembers.length) {
      staffMembers.forEach(x => {
        if (x.staffMemberId) {
          result.push(x.staffMemberId);
        }
      });
    }
    this.staffMemberIdList = result;
  }


  setupForm() {
    this.diaryEventForm = this.fb.group({
      startDateTime: new Date(),
      endDateTime: new Date(),
      startHour: this.getHours(),
      endHour: this.getHours(true),
      startMin: this.getMinutes(),
      endMin: this.getMinutes(),
      eventTypeId: [0],
      allDay: false,
      isConfirmed: false,
      hasReminder: false,
      duration: [30],
      durationType: [0],
      staffMembers: [''],
      properties: [''],
      contacts: [''],
      subject: [''],
      notes: [''],
    }, { validators: WedgeValidators.diaryEventEndDateValidator() });
  }

  populateForm(diaryEvent: DiaryEvent) {
    if (diaryEvent) {
      this.diaryEventForm.patchValue({
        startDateTime: new Date(diaryEvent.startDateTime),
        endDateTime: new Date(diaryEvent.endDateTime),
        startHour: this.getHours(false, diaryEvent.startDateTime),
        endHour: this.getHours(false, diaryEvent.endDateTime),
        startMin: this.getMinutes(diaryEvent.startDateTime),
        endMin: this.getMinutes(diaryEvent.endDateTime),
        eventTypeId: diaryEvent.eventTypeId,
        allDay: diaryEvent.allDay,
        isConfirmed: diaryEvent.isConfirmed,
        staffMembers: diaryEvent.staffMembers,
        properties: diaryEvent.properties,
        contacts: diaryEvent.contacts,
        subject: diaryEvent.subject,
        notes: diaryEvent.notes,
      });
    }
  }
  private getMinutes(date?: Date): any {
    let minutes: number;
    if (date) {
      minutes = getMinutes(date);
    } else {
      minutes = getMinutes(new Date());
      switch (true) {
        case minutes < 15:
          minutes = 15;
          break;
        case minutes > 15 && minutes < 30:
          minutes = 30;
          break;
        case minutes > 30 && minutes < 45:
          minutes = 45;
          break;
        default:
          minutes = 0;
          break;
      }
    }
    return minutes.toString().padStart(2, '0');
  }

  private getHours(addAnHour?: boolean, date?: Date): any {
    let hours: number;
    if (date) {
      hours = getHours(date);
    } else {
      hours = getHours(new Date());
      if (addAnHour) {
        hours += 1;
      }
    }
    return hours.toString().padStart(2, '0');
  }

  onStartDateChange(startDate) {
    console.log('start', startDate);
    this.diaryEventForm.get('endDateTime').setValue(startDate);
    // const con = isAfter(startDate, this.endDateTimeControl.value)
    // if (con) {
    //   this.minDate = startDate;
    // }
    // console.log('condition', con);
  }

  onEndDateChange(endDate) {
    console.log('end', endDate);
  }

  onAllDayCheck(event: any) {
    this.isAllDay = event.target.checked;
  }

  onReminderCheck(event) {
    this.isReminder = event.target.checked;
  }

  onEventTypeChange(eventTypeId: number) {
    this.toggleFlags(eventTypeId);
  }

  private toggleFlags(eventTypeId: number) {
    console.log('%c Should be hree', 'color: red');

    // set flags based on the event type selected
    const showAllType = this.showAllEventTypes.filter(x => +x.id === +eventTypeId);
    const showOnlyPropertiesType = this.showOnlyPropertyEventTypes.filter(x => +x.id === +eventTypeId);
    const showOnlyContactsType = this.showOnlyContactEventTypes.filter(x => +x.id === +eventTypeId);

    switch (true) {
      case !!showAllType.length:
        console.log('show showAll type xxxx', showAllType, 'id:', eventTypeId);
        this.showProperties = true;
        this.showContacts = true;
        this.showOthers = true;
        break;
      case !!showOnlyPropertiesType.length:
        console.log('showOnlyProperties type xxxx', showOnlyPropertiesType, 'id:', eventTypeId);
        this.showProperties = true;
        this.showContacts = false;
        this.showOthers = true;
        break;
      case !!showOnlyContactsType.length:
        console.log('showOnlyContacts type xxxx', showOnlyContactsType, 'id:', eventTypeId);
        this.showProperties = false;
        this.showContacts = true;
        this.showOthers = true;
        break;
      default:
        console.log('show others', eventTypeId);
        this.showProperties = false;
        this.showContacts = false;
        this.showOthers = true;
    }
  }

  getSelectedProperties(properties: Property[]) {
    if (properties && properties.length) {
      console.log('properties here', properties);
      this.diaryEventForm.get('properties').setValue(properties);
    }
  }

  getRebookedPropertyId(propertyId: number) {
    console.log('rebooked property id here', propertyId);
    if (propertyId) {
      this.isRebook = true;
      this.diaryEventForm.markAsDirty();
    } else {
      this.isRebook = false;
    }
  }
  getSelectedContactGroups(contacts: Signer[]) {
    console.log('contact groups  here', contacts);
    this.diaryEventForm.get('contacts').setValue(contacts);
  }

  getSelectedStaffMembers(staffMembers: BaseStaffMember[]) {
    console.log('staffMembers here', staffMembers);
    this.diaryEventForm.get('staffMembers').setValue(staffMembers);
  }

  private getAddedProperty() {
    this.propertyService.newPropertyAdded$.subscribe(newProperty => {
      if (newProperty) {
        this.property = newProperty;
        console.log('newly created property', newProperty);
      }
    });
  }

  setTime(hour: number, min: number) {
    return (`${hour}:${min}`);
  }

  saveDiaryEvent() {
    this.sharedService.logValidationErrors(this.diaryEventForm, true);
    if (this.diaryEventForm.valid) {
      if (this.diaryEventForm.dirty) {
        this.isSubmitting = true;
        this.addOrUpdateEvent();
      } else {
        this.onSaveComplete();
      }
    } else {
      console.log('form here', this.diaryEventForm);
    }
  }

  addOrUpdateEvent() {
    const event = { ...this.diaryEvent, ...this.diaryEventForm.value } as DiaryEvent;
    this.setDateTime(event);
    if (!event.staffMembers) {
      event.staffMembers = [];
      event.staffMembers = this.currentStaffMember;
    }
    this.setReminder(this.id, event.staffMembers);

    if (this.isNewEvent || this.isRebook) {
      this.diaryEventService.addDiaryEvent(event).subscribe(res => {
        if (res) {
          this.onSaveComplete(res);
        }
      });
    } else {
      this.diaryEventService.updateDiaryEvent(event).subscribe(res => {
        if (res) {
          this.onSaveComplete(res);
        }
      });
    }
  }

  deleteEvent(eventId: number) {
    this.showWarning().subscribe(res => {
      if (res) {
        this.diaryEventService.deleteDiaryEvent(eventId).subscribe((result: ResultData) => {
          if (result.status) {
            this.toastr.success('Diary event successfully deleted');
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  setReminder(id: number, staffMembers: BaseStaffMember[], isPatch = false) {
    if (staffMembers && staffMembers.length) {
      const member = staffMembers.find(x => x.staffMemberId === id);
      if (member) {
        if (isPatch) {
          this.diaryEventForm.patchValue({ duration: member.reminderUnits, durationType: member.reminderUnitType, hasReminder: member.hasReminder });
          member.hasReminder ? this.isReminder = true : this.isReminder = false;
        } else {
          member.hasReminder = true;
          member.reminderUnits = +this.diaryEventForm.get('duration').value || 0;
          member.reminderUnitType = +this.diaryEventForm.get('durationType').value || 0;

        }
      }
    }
  }

  // REFACTOR
  private setDateTime(event: DiaryEvent) {
    const startDateWithHour = setHours(event.startDateTime, +this.startHourControl.value);
    const startDateWithMinutes = setMinutes(startDateWithHour, +this.startMinControl.value);
    const endDateWithHour = setHours(event.endDateTime, +this.endHourControl.value);
    const endDateWithMinutes = setMinutes(endDateWithHour, +this.endMinControl.value);
    event.startDateTime = startDateWithMinutes;
    event.endDateTime = endDateWithMinutes;
  }

  onSaveComplete(diaryEvent?: DiaryEvent) {
    if (this.isNewEvent) {
      this.toastr.success('Diary event successfully saved');
      this.sharedService.resetUrl(this.diaryEventId, diaryEvent.diaryEventId);
    } else {
      this.toastr.success('Diary event successfully updated');
    }
    this.router.navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate(['/diary/edit', diaryEvent.diaryEventId]));
  }

  private setUtcDate(date) {
    return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes(),
      date.getSeconds(), date.getMilliseconds()));
  }

  trackByFn(index, item: BaseStaffMember) {
    if (!item) { return null; }
    return item.staffMemberId;
  }

  showAllMembers() {
    this.showMorePeople = !this.showMorePeople;
    this.diaryEvent.staffMembers = this.eventStaffMembers;
    console.log('%c this.diaryEvent.staffMembers', 'color: red', this.diaryEvent.staffMembers)
  }
  showFewMembers() {
    this.showMorePeople = !this.showMorePeople;
    this.diaryEvent.staffMembers = this.getStaff(this.eventStaffMembers);
    console.log('%c this.diaryEvent.staffMembers', 'color: green', this.diaryEvent.staffMembers)
  }

  canDeactivate(): boolean {
    if (this.diaryEventForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  cancel() {
    this.sharedService.back();
  }

  showWarning() {
    const subject = new Subject<boolean>();
    const initialState = {
      title: 'Are you sure you want to delete the event?',
      actions: ['No', 'Yes']
    };
    const modal = this.modalService.show(ConfirmModalComponent, { ignoreBackdropClick: true, initialState });
    modal.content.subject = subject;
    return subject.asObservable();
  }
}
