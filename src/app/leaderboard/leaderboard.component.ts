import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

import { LeaderboardService } from './shared/leaderboard.service';
import { Constants } from '../shared/period-list';
import { StaffMember, ApiRole } from '../shared/models/staff-member';
import {
  Leaderboard, LeaderboardResult, PeriodMap, Period, NegotiatorColumns,
  SalesManagerColumns, LettingsManagerColumns, LeaderboardColumns
} from './shared/leaderboard';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SharedService, WedgeError } from '../core/services/shared.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
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
  isFilterHidden: boolean;
  get periodControl(): FormControl {
    return <FormControl>this.leaderboardForm.get('period');
  }

  /**
   * Return the relevant columns based on role
   */
  get columns(): string[] {
    const role = this.currentStaffMember.dashboardMode;
    switch (role) {
      case ApiRole.LettingsNegotiator:
      case ApiRole.SalesNegotiator:
        return NegotiatorColumns;

      case ApiRole.SalesManager:
        return SalesManagerColumns;

      case ApiRole.LettingsManager:
        return LettingsManagerColumns;

      default:
        return SalesManagerColumns;
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
  }

  getPipeline() {
    this.leaderboardService
      .getStaffMemberPipeline()
      .subscribe(result => {
        this.pipelineList = result;
      });
  }

  setupForm() {
    this.leaderboardForm = this.fb.group({ period: [''] });
    this.leaderboardForm.patchValue({ period: Period.ThisYear });
  }

  getExchanges(period: string) {
    this.leaderboardService
      .getStaffMemberExchanges(period)
      .subscribe(result => {
        this.exchanges = result;
      });
  }

  getInstructions(period: string, pageSize: any) {
    this.leaderboardService
      .getStaffMemberInstructions(period, pageSize)
      .subscribe(result => {
        this.originalInstructions = result;
        if (result !== null) {
          this.instructions = result.slice(0, 16);
        }
      });
  }

  getSelectedTab(value) {
    this.active = value;
    if (value === LeaderboardColumns.Pipeline) {
      this.isFilterHidden = true;
    } else {
      this.isFilterHidden = false;
    }
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
        leaderboard$ = this.leaderboardService.getStaffMemberExchanges(period)
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
        leaderboard$ = this.leaderboardService.getStaffMemberPipeline()
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
        leaderboard$ = this.leaderboardService.getStaffMemberInstructions(period)
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
        leaderboard$ = this.leaderboardService.getStaffMemberViewingsCompleted(period)
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
        leaderboard$ = this.leaderboardService.getStaffMemberManagedTenancies(period)
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
    leaderboard$.subscribe(result => this.data = result, (error: WedgeError) => {
      this.sharedService.showError(error, 'leaderboard->leaderboard$');
    });
  }

}
