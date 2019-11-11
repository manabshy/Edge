import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiaryComponent } from '../diary.component';
import { baseDiaryEventTypes, valuationDiaryEventTypes, feedbackDiaryEventTypes } from '../shared/diary';
import { SharedService } from 'src/app/core/services/shared.service';
import { DiaryEventService } from '../shared/diary-event.service';

@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent extends DiaryComponent implements OnInit {
  eventTypes = feedbackDiaryEventTypes;
  isMeridian = false;
  showSpinners = false;
  public childItems: any[] = [];


  constructor(protected fb: FormBuilder,
    protected diaryEventService: DiaryEventService,
    protected sharedService: SharedService) {
    super(fb, diaryEventService, sharedService);
  }

  ngOnInit() {
    window.scrollTo(0,0);
    super.ngOnInit();
    this.eventTypes.push(...valuationDiaryEventTypes);
    this.eventTypes.push(...baseDiaryEventTypes);
    console.log(this.eventTypes);
  }
  canDeactivate(): boolean {
    return !!this.diaryEvent;
  }

  cancel() {
    this.sharedService.back();
  }
  public onDuplicate() {
    this.childItems.push(this.childItems.length);
  }
  public onRemove() {
    this.childItems.pop();
  }
}
