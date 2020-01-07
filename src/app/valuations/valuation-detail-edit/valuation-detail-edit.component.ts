import { Component, OnInit } from '@angular/core';
import { Property } from 'src/app/property/shared/property';
import { Signer } from 'src/app/contactgroups/shared/contact-group';
import { ValuationService } from '../shared/valuation.service';
import { ActivatedRoute } from '@angular/router';
import { Valuation } from '../shared/valuation';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-valuation-detail-edit',
  templateUrl: './valuation-detail-edit.component.html',
  styleUrls: ['./valuation-detail-edit.component.scss']
})
export class ValuationDetailEditComponent implements OnInit {

  staffMembers = [
    {
      id: 1,
      fullName: 'John Smith'
    },
    {
      id: 1,
      fullName: 'Bill Doe'
    }

  ];

  showCalendar = false;
  valuationId: number;
  valuation: Valuation;
  lastKnownOwner: Signer;
  valuationForm: FormGroup;

  constructor(private valuationService: ValuationService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.setupForm();
    this.valuationId = +this.route.snapshot.paramMap.get('id');
    if (this.valuationId) {
      this.getValuation(this.valuationId);
    }
  }

  setupForm() {
    this.valuationForm = this.fb.group({
      outside: [null],
      parking: [null],
      features: [null]
    });
  }

  selectStaffMember(staffMember: any) {
    this.showCalendar = true;
  }

  getValuation(id: number) {
    this.valuationService.getValuation(id).subscribe((data => {
      if (data) {
        this.valuation = data;
        this.populateForm(data);
      }
    }));
  }

  populateForm(valuation: Valuation) {
    if (this.valuationForm) {
      this.valuationForm.reset();
    }
    if (valuation) {

    }
  }

  getSelectedProperty(property: Property) {
    if (property) {
      console.log('selected property', property);
    }
  }

  getSelectedOwner(owner: Signer) {
    if (owner) {
      this.lastKnownOwner = owner;
      console.log('selected owner', owner);
    }
  }
}
