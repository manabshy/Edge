import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ContactGroup } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit, OnChanges {
  @Input() contactGroup: ContactGroup;
  emailFormGroup: FormGroup;
  text1: string = '<div>Hello World!</div><div>PrimeNG <b>Editor</b> Rocks</div><div><br></div>';
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.emailFormGroup = this.fb.group(({
      senderEmail: [''],
      recipientEmail: [''],
      ccInternalEmail: [''],
      ccExternalEmail: [''],
      subject: [''],
      body: ['', Validators.required]
    }));
  }

  ngOnChanges(){
    if(this.contactGroup){
      console.log(this.contactGroup, 'group');

    }
  }


  send() { }
}
