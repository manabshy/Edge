import { Component, OnInit, Input, SimpleChanges, OnChanges, AfterViewInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { LeaderboardService } from './shared/leaderboard.service';
import { Constants } from '../core/shared/period-list';
import { StaffMember, ApiRole } from '../shared/models/staff-member';
import {
  Leaderboard, LeaderboardResult, PeriodMap, Period, NegotiatorColumns,
  SalesManagerColumns, LettingsManagerColumns, LeaderboardColumns, LeaderboardSort
} from './shared/leaderboard';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SharedService } from '../core/services/shared.service';
import { ToastrService } from 'ngx-toastr';
import { AppUtils } from '../core/shared/utils';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnChanges, AfterViewInit {
  private readonly salesManager = 'salesManager';
  private readonly lettingsManager = 'lettingsManager';
  private readonly lettingsNegotiator = 'lettingsNegotiator';
  @Input() currentStaffMember: StaffMember;
  data: Leaderboard[];
  originalInstructions: Leaderboard[] = [];
  instructions: Leaderboard[] = [];
  pipelineList: Leaderboard[] = [];
  exchanges: Leaderboard[] = [];
  leaderboardResult: LeaderboardResult;
  resultCount: number;
  selectedPeriodLabel: string;
  periodList = Constants.PeriodList;
  periods = PeriodMap;
  filterVisibility = 'visible';
  leaderboardForm: FormGroup;
  active: string;
  get periodControl(): FormControl {
    return <FormControl>this.leaderboardForm.get('period');
  }
  /**
   * Return the relevant columns based on role
   */
  get columns(): string[] {
    switch (this.currentStaffMember.jobTitle) {

      case ApiRole.LettingsNegotiator:
      case ApiRole.SalesNegotiator:
        return NegotiatorColumns;

      case ApiRole.SalesManager:
        return SalesManagerColumns;

      case ApiRole.LettingsManager:
        return LettingsManagerColumns;

      default:
        return LettingsManagerColumns;
        // return NegotiatorColumns;
        // return SalesManagerColumns;
      // return [];
    }
  }

  /**
   * Determine how to format the column
   */
  get managedOrFees(): string {
    switch (this.active) {
      case LeaderboardColumns.Exchanges:
      case LeaderboardColumns.Pipeline:
        return 'currency';

      case LeaderboardColumns.Managed:
        return 'percent';

      default:
        return null;
    }
  }

  public keepOriginalOrder = (a) => a.key;

  constructor(
    private leaderboardService: LeaderboardService,
    private sharedService: SharedService,
    private toastrService: ToastrService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setupForm();
    this.active = this.columns[0];
    if (this.periodControl.value) {
      this.downloadLeaderboard(Period[this.periodControl.value]);
    }

    this.leaderboardForm.valueChanges.subscribe(data => {
      this.selectedPeriodLabel = this.periods.get(+data.period);
      this.downloadLeaderboard(Period[data.period]);
    });
    // this.getPipeline();
  }
  ngOnChanges(changes: SimpleChanges) {

    // if (changes['role'] && changes['role'].currentValue) {
    //   this.active = this.columns[0];
    // }
  }

  ngAfterViewInit() {
    // if (this.data) {
    //   this.downloadLeaderboard(Period[this.periodControl.value]);
    // }
  }
  getPipeline() {
    this.leaderboardService
      .getStaffMemberPipeline(this.salesManager)
      .subscribe(result => {
        this.pipelineList = result;
        console.log('pipeline results', result);
      });
  }

  setupForm() {
    this.leaderboardForm = this.fb.group({ period: [''] });
    this.leaderboardForm.patchValue({ period: Period.ThisYear });
  }

  getExchanges(role: string, period: string) {
    this.leaderboardService
      .getStaffMemberExchanges(role, period)
      .subscribe(result => {
        this.exchanges = result;
        console.log('exchanges results', result);
      });
  }

  getInstructions(role: string, period: string, pageSize: any) {
    this.leaderboardService
      .getStaffMemberInstructions(role, period, pageSize)
      .subscribe(result => {
        this.originalInstructions = result;
        if (result !== null) {
          this.instructions = result.slice(0, 16);
        }
      });
  }
  getSelectedTab(value) {
    this.active = value;
    console.log('period value', this.periodControl.value)
    this.downloadLeaderboard(Period[this.periodControl.value]);
  }

  downloadLeaderboard(period: string) {
    // clear the data
    if (Array.isArray(this.data) && this.data.length) {
      this.data = null;
    }

    let leaderboard$: Observable<Leaderboard[]>;
    switch (this.active) {
      case LeaderboardColumns.Exchanges:
        leaderboard$ = this.leaderboardService.getStaffMemberExchanges(this.salesManager, period)
          .pipe(
            map(data => {
              return data.map(person => {
                const name = person.fullName;
                const managedOrFees = person.totalFees;
                const total = person.totalCount;
                return { name, managedOrFees, total };
              });
            }),
            tap(data => console.log(data))
          );
        break;
      case LeaderboardColumns.Pipeline:
        leaderboard$ = this.leaderboardService.getStaffMemberPipeline(this.salesManager)
          .pipe(
            map(data => {
              return data.map(person => {
                const name = person.fullName;
                const managedOrFees = person.totalFees;
                const total = person.totalCount;
                return { name, managedOrFees, total };
              });
            }),
            tap(data => console.log(data))
          );
        break;
      case LeaderboardColumns.Instructions:
        leaderboard$ = this.leaderboardService.getStaffMemberInstructions(this.salesManager, period)
          .pipe(
            map(data => {
              return data.map(person => {
                const name = person.fullName;
                const total = person.totalCount;
                return { name, total };
              });
            }),
            tap(data => console.log(data))
          );
        break;
      case LeaderboardColumns.ViewingsCompleted:
        leaderboard$ = this.leaderboardService.getStaffMemberViewingsCompleted(this.lettingsNegotiator, period)
          .pipe(
            map(data => {
              return data.map(person => {
                const name = person.fullName;
                const total = person.totalCount;
                return { name, total };
              });
            }),
            tap(data => console.log(data))
          );
        break;
      case LeaderboardColumns.Managed:
        leaderboard$ = this.leaderboardService.getStaffMemberManagedTenancies(this.salesManager, period)
          .pipe(
            map(data => {
              return data.map(person => {
                const name = person.fullName;
                const managedOrFees = ((person.managedCount || 0) / person.totalCount);
                return { name, managedOrFees };
              });
            }),
            tap(data => console.log(data))
          );
        break;
    }
    if (!leaderboard$) {
      this.toastrService.warning('Unable to download leaderboard');
    }
    leaderboard$.subscribe(result => { this.data = result; console.log('downloaded leaderboard', result) });
    // leaderboard$.pipe(tap(result => this.data = result), tap(res => console.log('downloaded leaderboard', res ))).subscribe();
  }

  showFilter(val: string) {
    this.filterVisibility = val;
  }
}
