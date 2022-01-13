import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-send-edetails',
  templateUrl: './send-edetails.component.html',
  styleUrls: ['./send-edetails.component.css']
})

export class SendEdetailsComponent {
  
  constructor( 
    private route: ActivatedRoute,
    private router: Router
   ) {}

   onSubmit() {
    // TODO: Use EventEmitter with form value
    // This doesn't work!
    this.router.navigate(['/applicant-matching']);
    return false;
  }  
}
