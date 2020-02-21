import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiaryComponent } from '../diary.component';
import { baseDiaryEventTypes, valuationDiaryEventTypes, feedbackDiaryEventTypes } from '../shared/diary';
import { SharedService } from 'src/app/core/services/shared.service';
import { DiaryEventService } from '../shared/diary-event.service';
import { AppUtils } from 'src/app/core/shared/utils';
import { StorageMap } from '@ngx-pwa/local-storage';
import { DropdownListInfo, InfoDetail } from 'src/app/core/services/info.service';

@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent implements OnInit {
  eventTypes: InfoDetail[];
  diaryEventForm: FormGroup;
  isSubmitting: any;
  minutes = ['00', '15', '30', '45']
  get hours() {
    const result = [];
    for (let hr = 0; hr < 24; hr++) {
      const hrStr = hr.toString().padStart(2, '0');
      result.push(hrStr);
    }
    return result;
  }


  constructor(private fb: FormBuilder,
    private diaryEventService: DiaryEventService,
    private storage: StorageMap,
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
      startDate: [''],
      endDate: [''],
      startTime: [''],
      endTime: [''],
      eventType: [0],
      allDay: false,
      staffMembers: [''],
      properties: [''],
      applicants: [''],
      notes: [''],
    });
  }
  onStartDateChange(startDate) {
    console.log('start', startDate);
  }
  onEndDateChange(endDate) {
    console.log('end', endDate);
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
