import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { DiaryComponent } from '../diary.component';

@Component({
  selector: 'app-add-diary-event',
  templateUrl: './add-diary-event.component.html',
  styleUrls: ['./add-diary-event.component.scss']
})
export class AddDiaryEventComponent extends DiaryComponent implements OnInit {

  constructor(protected fb: FormBuilder) {
    super(fb);
   }

  ngOnInit() {
    super.ngOnInit();
  }

}
