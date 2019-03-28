import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiaryComponent } from '../diary.component';
import { baseDiaryEventTypes, valuationDiaryEventTypes, feedbackDiaryEventTypes } from '../shared/diary';
import { SharedService } from 'src/app/core/services/shared.service';

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


  constructor(protected fb: FormBuilder, private sharedService: SharedService) {
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
