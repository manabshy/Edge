import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-redacted-table',
  templateUrl: './redacted-table.component.html',
  styleUrls: ['./redacted-table.component.scss']
})
export class RedactedTableComponent implements OnInit {
  @Input() message: string;
  constructor() { }

  ngOnInit(): void {
  }

}
