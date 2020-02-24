import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiaryComponent } from '../diary.component';
import { baseDiaryEventTypes, valuationDiaryEventTypes, feedbackDiaryEventTypes, DiaryEvent } from '../shared/diary';
import { SharedService } from 'src/app/core/services/shared.service';
import { DiaryEventService } from '../shared/diary-event.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service';
import { getHours, getMinutes, addHours } from 'date-fns';
import { Property } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent implements OnInit {
  eventTypes: InfoDetail[];
  diaryEventForm: FormGroup;
  isSubmitting: any;
  minutes = ['00', '15', '30', '45'];
  durationTypes = ['minute(s)', 'hour(s)', 'day(s)', 'week(s)'];
  isNewEvent: any;

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


  constructor(private fb: FormBuilder,
    private diaryEventService: DiaryEventService,
    private storage: StorageMap,
    private toastr: ToastrService,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.setupForm();
    this.storage.get('info').subscribe((info: DropdownListInfo) => {
      this.eventTypes = info.diaryEventTypes;
    });
  }

  setupForm() {
    this.diaryEventForm = this.fb.group({
      startDate: new Date(),
      endDate: new Date(),
      startTime: this.getHours(),
      endTime: this.getHours(true),
      startMin: this.getMinutes(),
      endMin: this.getMinutes(),
      eventType: [0],
      allDay: false,
      hasReminder: false,
      duration: [0],
      durationType: [0],
      staffMembers: [''],
      properties: [''],
      contactgroups: [''],
      notes: [''],
    });
  }
  private getMinutes(): any {
    let minutes = getMinutes(new Date());
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
    return minutes.toString().padStart(2, '0');
  }

  private getHours(addAnHour?: boolean): any {
    let hours = getHours(new Date());
    if (addAnHour) {
      hours += 1;
    }
    return hours.toString().padStart(2, '0');
  }

  onStartDateChange(startDate) {
    console.log('start', startDate);
  }
  onEndDateChange(endDate) {
    console.log('end', endDate);
  }

  getSelectedProperties(properties: Property[]) {
    console.log('properties here', properties)
    this.diaryEventForm.get('properties').setValue(properties)
  }

  getSelectedContactGroups(contactGroup: Signer) {
    console.log('contact groups  here', contactGroup)
    this.diaryEventForm.get('contactgroups').setValue(contactGroup);
  }

  setTime(hour: number, min: number) {
    return (`${hour}:${min}`);
  }

  saveDiaryEvent() {
    this.sharedService.logValidationErrors(this.diaryEventForm, true);
    if (this.diaryEventForm.valid) {
      if (this.diaryEventForm.dirty) {
        this.addOrUpdateEvent();
      } else {
        this.onSaveComplete();
      }
    } else {

    }
  }

  addOrUpdateEvent() {
    console.log('add or update here')
  }

  onSaveComplete(diaryEvent?: DiaryEvent) {
    if (this.isNewEvent) { this.toastr.success('Diary event successfully saved'); } else {
      this.toastr.success('Diary event successfully updated');
    }
  }

  canDeactivate(): boolean {
    if (this.diaryEventForm.dirty) {
      return false;
    }
    return true;
  }

  cancel() {
    this.sharedService.back();
  }
}
