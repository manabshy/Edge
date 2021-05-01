import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-email-signature',
  templateUrl: './email-signature.component.html',
  styleUrls: ['./email-signature.component.scss']
})
export class EmailSignatureComponent implements OnInit {
  @Input() signature: string;
  
  constructor() { }

  ngOnInit(): void {
  }

}
