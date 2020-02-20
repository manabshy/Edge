import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DiaryComponent } from '../diary.component';
import { baseDiaryEventTypes, valuationDiaryEventTypes, feedbackDiaryEventTypes } from '../shared/diary';
import { SharedService } from 'src/app/core/services/shared.service';
import { DiaryEventService } from '../shared/diary-event.service';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent implements OnInit {
  eventTypes = feedbackDiaryEventTypes;
  diaryEventForm: FormGroup;
  isSubmitting: any;

  constructor(private fb: FormBuilder,
    private diaryEventService: DiaryEventService,
    private sharedService: SharedService) {
  }

  ngOnInit() {
    window.scrollTo(0, 0);
    this.setupForm();
  }

  setupForm() {
    this.diaryEventForm = this.fb.group({
      startDate: [''],
      endDate: [''],
      startDateTime: [''],
      endDateTime: [''],
      eventType: [''],
      staffMembers: [''],
      properties: [''],
      applicants: [''],
      notes: [''],
    });
  }
  onStartDateChange(startDate) {
    console.log('start', startDate)
  }
  onEndDateChange(endDate) {
    console.log('end', endDate)
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
