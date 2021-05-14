import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { PeriodService } from 'src/app/core/services/period.service';
import { PeriodList, Periods, PeriodsEnum } from '../shared/dashboard';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {
  bsRangeValue: any;
  filtersForm: FormGroup;
  periods = PeriodList;
  showCustomDates: boolean;

  constructor(private fb: FormBuilder, private periodService: PeriodService) { }

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      period: []
    });

    this.filtersForm.valueChanges.subscribe(data => {
      if (data?.period === 'Custom') {
        console.log('custom...');
        this.showCustomDates = true;
      } else {

        let test = this.periodService.getInterval(data.period);
        console.log({ test });
      }
    })
  }


  cancel() { this.showCustomDates = false; }

  onDateChange(value: Date): void {
    this.bsRangeValue = value;
  }

  getCustomDate() {
    if (this.bsRangeValue) {
      console.log(this.bsRangeValue, 'custom date');
      let customDate = this.periodService.getInterval(PeriodsEnum.Custom, this.bsRangeValue[0], this.bsRangeValue[1])
      console.log({ customDate });

      this.showCustomDates = false;
    }
  }
}


