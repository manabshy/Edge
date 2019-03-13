import { Component, OnInit, Input } from '@angular/core';
import { OffersResult, Offer } from '../shared/dashboard';

@Component({
  selector: 'app-offer-list',
  templateUrl: './offer-list.component.html',
  styleUrls: ['./offer-list.component.css']
})
export class OfferListComponent implements OnInit {
  @Input() offers: Offer[];

  constructor() { }

  ngOnInit() {
  }

}
