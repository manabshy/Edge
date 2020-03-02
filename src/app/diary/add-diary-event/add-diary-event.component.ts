import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { DiaryEvent } from '../shared/diary';
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
  durationTypes = ['minute(s)', 'hour(s)', 'day(s)'];
  isNewEvent: boolean;
  diaryEvent: DiaryEvent;
  diaryEventId: number;
  isAllDay = false;
  isReminder = true;
  showProperties = true;
  showContacts = true;
  showStaffMembers = true;
  maxDate = null;
  minDate = new Date();
  formErrors = FormErrors;
  propertyLabel = 'Properties';
  contactLabel = 'Contacts';
  eventTypesMap: Map<number, string>;
  property: Property;
  staffMemberIdList: number[];
  graphEventId: string;

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
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.diaryEventId = +this.route.snapshot.paramMap.get('id');
    this.graphEventId = this.route.snapshot.queryParamMap.get('graphEventId');
    this.isNewEvent = this.route.snapshot.queryParamMap.get('isNewEvent') as unknown as boolean;
    console.log('is new event', this.isNewEvent);
    this.setupForm();
    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      this.eventTypes = info.diaryEventTypes;
      // if (this.eventTypes && this.eventTypes.length) {
      //   const mappedData = this.eventTypes.map(x => [x.id, x.value] as [number, string]);
      //   this.eventTypesMap = new Map<number, string>(mappedData);
      // }
    });

    if (this.diaryEventId || this.graphEventId) {
      this.diaryEventService.getDiaryEventById(this.diaryEventId, this.graphEventId)
        .subscribe(event => {
          this.diaryEvent = event;
          this.setStaffMemberIdList(event.staffMembers);
          this.populateForm(event);
          console.log('event details', event);
        });
    }
    this.getAddedProperty();
    this.diaryEventForm.valueChanges.subscribe(data => {
      this.sharedService.logValidationErrors(this.diaryEventForm, false);
    });
  }

  setStaffMemberIdList(staffMembers: BaseStaffMember[]) {
    const result = [];
    staffMembers.forEach(x => {
      if (x.staffMemberId) {
        result.push(x.staffMemberId);
      }
    });
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
      hasReminder: true,
      duration: [30],
      durationType: ['minute(s)'],
      staffMembers: [''],
      properties: [''],
      contacts: [''],
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
        hasReminder: diaryEvent.hasReminder,
        duration: diaryEvent.totalHours,
        durationType: 'hour(s)',
        staffMembers: diaryEvent.staffMembers,
        properties: diaryEvent.properties,
        contacts: diaryEvent.contacts,
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
    console.log('eventId', eventTypeId);
  }

  getSelectedProperties(properties: Property[]) {
    console.log('properties here', properties);
    this.diaryEventForm.get('properties').setValue(properties);
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

  private setLabels(id: number) {

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
    console.log('start date and time', event.startDateTime);
    if (this.isNewEvent) {
      this.diaryEventService.addDiaryEvent(event).subscribe(res => {
        if (res) {
          this.onSaveComplete(res);
        }
      });
    } else {
      this.diaryEventService.updateDiaryEvent(this.diaryEventId).subscribe(res => {
        if (res) {
          this.onSaveComplete(res);
        }
      });

    }
    console.log('add or update here');
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

  canDeactivate(): boolean {
    if (this.diaryEventForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  cancel() {
    this.sharedService.back();
  }
}
