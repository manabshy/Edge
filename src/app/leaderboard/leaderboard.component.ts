import { Component, OnInit, Input } from '@angular/core';

import { LeaderboardService } from './shared/leaderboard.service';
import { Leaderboard, LeaderboardResult, PeriodMap, Period } from './shared/leaderboard';
import { Constants } from '../core/shared/period-list';
import { StaffMember } from '../core/models/staff-member';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-leaderboard',
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit {
  private readonly salesManager = 'salesManager';
  @Input() currentStaffMember: StaffMember;
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
  get periodControl(): FormControl {
    return <FormControl> this.leaderboardForm.get('period');
  }
  public keepOriginalOrder = (a) => a.key;

  constructor(
    private leaderboardService: LeaderboardService,
    private fb: FormBuilder
  ) { }

  ngOnInit() {
    this.setupForm();
    if (this.periodControl.value) {
      this.getExchanges(this.salesManager, Period[this.periodControl.value] );
      this.getInstructions(this.salesManager, Period[this.periodControl.value], 100);
    }
    this.leaderboardForm.valueChanges.subscribe(data => {
      console.log('input', Period[data.period]);
      console.log('key', data.period);
      this.selectedPeriodLabel = this.periods.get(+data.period);
      console.log('label', this.selectedPeriodLabel);
      this.getExchanges(this.salesManager, Period[data.period]);
      this.getInstructions(this.salesManager, Period[data.period], 100);
    });
    this.getPipeline();
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
    this.leaderboardForm.patchValue({ period: Period.ThisYear});
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

  showFilter(val: string) {
    this.filterVisibility = val;
  }
}
