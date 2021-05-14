import { Injectable } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { addDays, addHours, isBefore, isEqual, setHours, setMinutes, setSeconds, startOfWeek, subHours, subMonths } from 'date-fns';
import { isAfter } from 'date-fns/esm';
import { PeriodsEnum, ReportingMonth } from 'src/app/dashboard/shared/dashboard';
import { ResultData } from 'src/app/shared/result-data';
import { DropdownListInfo, InfoService } from './info.service';

@Injectable({
  providedIn: 'root'
})
export class PeriodService {
  reportingMonths: ReportingMonth[] = [];

  constructor(private infoService: InfoService, private storage: StorageMap) { this.getReportingMonths(); }

  getReportingMonths() {
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.reportingMonths = data.reportingMonths;
        console.log(' in period service from storage', data);
      } else {
        this.getInfoFromDb();
      }
    });
  }

  private getInfoFromDb() {
    this.infoService.getDropdownListInfo().subscribe((info: ResultData | any) => {
      if (info) {
        this.reportingMonths = info.reportingMonths;
        console.log(' period service from db', info.result);
      }
    });
  }


  getReportingQuarter(reportingMonth: ReportingMonth) {

    const quarterNumber = Math.floor(reportingMonth.month / 4);
    const quarterStartMonth = (quarterNumber * 3) + 1;
    const startOfQuarter = this.reportingMonths.find(x => x.month === quarterStartMonth && x.year === reportingMonth.year);
    console.log({ startOfQuarter });

    return startOfQuarter?.startDate;
  }

  getReportingYear(reportingMonth: ReportingMonth) {
    const startOfYear = this.reportingMonths.find(x => x.year === reportingMonth.year && x.month === 1);
    return startOfYear.startDate;
  }

  getInterval(period?: PeriodsEnum, customStartDate?: Date, customEndDate?: Date) {
    if (period == null) { period = PeriodsEnum.ThisMonth; }
    let periodStartDate = new Date(1950, 1, 1);
    let periodEndDate = new Date(1950, 1, 1);
    const currentDate = new Date();

    const reportingMonth =
      this.reportingMonths.find(x => (isEqual(new Date(x.startDate), currentDate) || isBefore(new Date(x.startDate), currentDate)) &&
        (isEqual(new Date(x.endDate), currentDate) || isAfter(new Date(x.endDate), currentDate)));
    console.log(this.reportingMonths);


    switch (period) {
      case PeriodsEnum.Today:
        periodEndDate = new Date(currentDate.setHours(23, 59, 59)); // 23:59
        periodStartDate = new Date(currentDate.setHours(0, 0, 0)); // 00:00
        break;
      case PeriodsEnum.ThisWeek:
        periodStartDate = new Date(startOfWeek(currentDate, { weekStartsOn: 6 })); // 17:00
        periodEndDate = addDays(new Date(periodStartDate.setHours(16, 59)), 6); // 16:59
        periodStartDate.setHours(17, 0);
        break;
      case PeriodsEnum.ThisMonth:
        periodStartDate = addHours(new Date(reportingMonth?.startDate), 17); // 17:00
        periodEndDate = this.getCurrentReportingMonthEndDate(reportingMonth); // current reporting month end (16:59)
        break;
      case PeriodsEnum.ThisQuarter:
        periodStartDate = addHours(new Date(this.getReportingQuarter(reportingMonth)), 17); // 17:00
        periodEndDate = this.getCurrentReportingMonthEndDate(reportingMonth); // current reporting month end (16:59)
        break;
      case PeriodsEnum.ThisYear:
        periodStartDate = addHours(new Date(this.getReportingYear(reportingMonth)), 17); // 17:00
        periodEndDate = this.getCurrentReportingMonthEndDate(reportingMonth); // current reporting month end (16:59)
        break;
      case PeriodsEnum.Custom:
        if (isEqual(customStartDate, customEndDate)) {
          periodStartDate = new Date(customStartDate.setHours(0, 0, 0)); // 00:00
          periodEndDate = new Date(customStartDate.setHours(23, 59, 59)); // 23:59
        } else {
          periodStartDate = new Date(customStartDate.setHours(17, 0, 0)); // 17:00
          periodEndDate = new Date(customEndDate.setHours(16, 59, 0)); // 16:59
        }
        break;
    }

    return { periodStartDate, periodEndDate };
  }

  getCurrentReportingMonthEndDate = (reportingMonth: ReportingMonth) => subHours(new Date(reportingMonth?.endDate), 7);
}
