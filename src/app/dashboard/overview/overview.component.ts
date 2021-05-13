import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PeriodList, Periods, PeriodsEnum } from '../shared/dashboard';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  cities: City[];
  bsRangeValue: any;
  selectedCity: City;
  filtersForm: FormGroup;
  periods = PeriodList;
  showCustomDates: boolean;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      period: []
    });

    this.filtersForm.valueChanges.subscribe(data => {
      if (data?.period === 'Custom') {
        console.log('custom...');
        this.showCustomDates = true;
      }
      console.log({ data })
    })
  }


  cancel() { this.showCustomDates = false; }

  onDateChange(value: Date): void {
    console.log({ value });
    this.bsRangeValue = value;
  }

  getCustomDate() {
    if (this.bsRangeValue) {
      console.log(this.bsRangeValue, 'custom date');
      this.showCustomDates = false;
    }
  }
}

interface City {
  name: string;
  code: string;
}
