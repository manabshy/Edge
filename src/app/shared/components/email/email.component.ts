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
 
  selectedCities3 =''
  groupedCities = [
    {
        label: 'Germany', value: 'de',
        items: [
            {label: 'Berlin', value: 'Berlin'},
            {label: 'Frankfurt', value: 'Frankfurt'},
            {label: 'Hamburg', value: 'Hamburg'},
            {label: 'Munich', value: 'Munich'}
        ]
    },
    {
        label: 'USA', value: 'us',
        items: [
            {name: 'Chicago', value: 'Chicago'},
            {name: 'Los Angeles', value: 'Los Angeles'},
            {name: 'New York', value: 'New York'},
            {name: 'San Francisco', value: 'San Francisco'}
        ]
    },
    {
        label: 'Japan', value: 'jp',
        items: [
            {name: 'Kyoto', value: 'Kyoto'},
            {name: 'Osaka', value: 'Osaka'},
            {name: 'Tokyo', value: 'Tokyo'},
            {name: 'Yokohama', value: 'Yokohama'}
        ]
    }
];

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
