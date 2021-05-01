import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-additional-info',
  templateUrl: './additional-info.component.html',
  styleUrls: ['./additional-info.component.scss']
})
export class AdditionalInfoComponent implements OnInit {
  @Input() id : string;
  constructor() { }

  ngOnInit() {
  }

}
