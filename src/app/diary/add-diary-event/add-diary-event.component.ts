import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiaryComponent } from '../diary.component';
import { baseDiaryEventTypes, valuationDiaryEventTypes, feedbackDiaryEventTypes } from '../shared/diary';

@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent extends DiaryComponent implements OnInit {
  eventTypes = feedbackDiaryEventTypes;
  isMeridian = false;
  showSpinners = false;

  constructor(protected fb: FormBuilder) {
    super(fb);
  }

  ngOnInit() {
    super.ngOnInit();
    this.eventTypes.push(...valuationDiaryEventTypes);
    this.eventTypes.push(...baseDiaryEventTypes);
    console.log(this.eventTypes);
  }
  canDeactivate(): boolean {
    return !!this.diaryEvent;
  }
}
