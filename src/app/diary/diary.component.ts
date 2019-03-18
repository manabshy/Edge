import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  isDropup = false;
diaryEventForm: FormGroup;
  constructor() { }

  ngOnInit() {
    this.setDropup();
  }

  setDropup() {
    if (window.innerWidth < 576) {
      this.isDropup = true;
    } else {
      this.isDropup = false;
    }
  }

}
