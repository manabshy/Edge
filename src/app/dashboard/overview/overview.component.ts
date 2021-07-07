import { enumDepartments } from "./../../core/shared/departments";
import {
  AfterViewInit,
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";
import { BsLocaleService } from "ngx-bootstrap/datepicker";
import { PeriodService } from "src/app/core/services/period.service";
import {
  LeaderboardRankingViewEnum,
  PeriodList,
  Periods,
  PeriodsEnum,
  RankingOptions,
  Roles,
} from "../shared/dashboard";
import moment from "moment";
import { DaterangepickerConfig } from "ng2-daterangepicker";
import { DaterangepickerComponent } from "ng2-daterangepicker";
import { TeamMember } from "src/app/client-services/shared/models/team-member";
import { CsBoardService } from "src/app/client-services/shared/services/cs-board.service";
import { tap } from "rxjs/operators";
import { StorageMap } from "@ngx-pwa/local-storage";
import { Observable } from "rxjs";
import { StaffMember } from "src/app/shared/models/staff-member";
import { StaffMemberService } from "src/app/core/services/staff-member.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Constants } from "src/app/shared/period-list";
import { LeaderBoardRanking } from "src/app/shared/models/leader-board-ranking";

@Component({
  selector: "app-overview",
  templateUrl: "./overview.component.html",
  styleUrls: ["./overview.component.scss"],
})
export class OverviewComponent implements OnInit, AfterViewInit {
  bsRangeValue: any;
  filtersForm: FormGroup;
  periods = PeriodList;
  showCustomDates: boolean;
  range: any;
  statsUpdated = new Date();
  statsUpdatedString: string;
  public daterange: any = {};
  members: TeamMember[];
  // @Output() showRules = new EventEmitter<boolean>();
  @Output() selectedMember = new EventEmitter<TeamMember>();
  members$ = new Observable<TeamMember[]>();
  searchPlaceHolder = "Select User";
  currentStaffMember: StaffMember;

  rankingOptions = RankingOptions;
  rankings: LeaderBoardRanking[] = [];
  selectedRole = Roles[0];
  roles = Roles;

  // see original project for full list of options
  // can also be setup using the config service to apply to multiple pickers

  @ViewChild(DaterangepickerComponent)
  private picker: DaterangepickerComponent;

  constructor(
    private fb: FormBuilder,
    private periodService: PeriodService,
    private daterangepickerOptions: DaterangepickerConfig,
    private boardService: CsBoardService,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.periodService.onReportingMonthsOnSelected.subscribe((data) => {
      console.log(data);
      if (data && data.length > 0) {
        let todayRange = this.periodService.getInterval(PeriodsEnum.Today);
        let weekRange = this.periodService.getInterval(PeriodsEnum.ThisWeek);
        let monthRange = this.periodService.getInterval(PeriodsEnum.ThisMonth);
        let yearRange = this.periodService.getInterval(PeriodsEnum.ThisYear);
        let quarterRange = this.periodService.getInterval(
          PeriodsEnum.ThisQuarter
        );

        this.range = {
          Today: [
            moment().set({
              hour: 0,
              minute: 0,
            }),
            moment(todayRange.periodEndDate).set({
              hour: todayRange.periodEndDate.getHours(),
              minute: todayRange.periodEndDate.getMinutes(),
            }),
          ],
          ThisWeek: [
            moment(weekRange.periodStartDate).set({
              hour: weekRange.periodStartDate.getHours(),
              minute: 1,
            }),
            moment(weekRange.periodEndDate).set({
              hour: weekRange.periodEndDate.getHours(),
              minute: weekRange.periodEndDate.getMinutes(),
            }),
          ],
          ThisMonth: [
            moment(monthRange.periodStartDate).set({
              hour: monthRange.periodStartDate.getHours(),
              minute: 1,
            }),
            moment(monthRange.periodEndDate).set({
              hour: monthRange.periodEndDate.getHours(),
              minute: monthRange.periodEndDate.getMinutes(),
            }),
          ],
          ThisQuarter: [
            moment(quarterRange.periodStartDate).set({
              hour: quarterRange.periodStartDate.getHours(),
              minute: 1,
            }),
            moment(quarterRange.periodEndDate).set({
              hour: quarterRange.periodEndDate.getHours(),
              minute: quarterRange.periodEndDate.getMinutes(),
            }),
          ],
          ThisYear: [
            moment(yearRange.periodStartDate).set({
              hour: yearRange.periodStartDate.getHours(),
              minute: 1,
            }),
            moment(yearRange.periodEndDate).set({
              hour: yearRange.periodEndDate.getHours(),
              minute: yearRange.periodEndDate.getMinutes(),
            }),
          ],
        };
        this.daterangepickerOptions.settings = {
          timePicker24Hour: true,
          timePicker: true,
          startDate: moment().set({
            hour: 0,
            minute: 0,
          }),
          enddate: moment(todayRange.periodEndDate).set({
            hour: todayRange.periodEndDate.getHours(),
            minute: todayRange.periodEndDate.getMinutes(),
          }),
          timePickerSeconds: "false",
          opens: "center",
          locale: {
            format: "MMMM DD YYYY HH:mm A",
          },
          ranges: this.range,
          alwaysShowCalendars: false,
        };
      }
    });

    this.members$ = this.boardService.getCsBoard().pipe(
      tap((data) => {
        this.members = data;
        this.storage.set("adminPanelBoard", data).subscribe();
      })
    );

    this.storage.get("currentUser").subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService
          .getCurrentStaffMember()
          .subscribe((res) => (this.currentStaffMember = res));
      }
    });
    this.statsUpdatedString = moment(this.statsUpdated).format(
      "MMMM DD YYYY HH:mm A"
    );
  }
  ngAfterViewInit(): void {}

  ngOnInit(): void {
    this.filtersForm = this.fb.group({
      selectedRankingOption: [RankingOptions[0]],
    });

    this.filtersForm.valueChanges.subscribe((data) => {});
  }

  getRankingInformation() {
    this.storage.get("rankings").subscribe((data: LeaderBoardRanking[]) => {
      if (data) {
        this.rankings = data;
      } else {
        // todo
        // this.staffMemberService
        //   .getRankings(
        //     this.filtersForm.get("selectedRankingOption").value?.value
        //   )
        //   .subscribe((res) => (this.rankings = res));
      }
    });
  }

  getSelectedOwner(event: any) {
    this.currentStaffMember = event;
    console.log(event);
  }

  public selectedDate(value: any, datepicker?: any) {
    // this is the date  selected
    console.log(value);

    // any object can be passed to the selected event and it will be passed back here
    datepicker.start = moment().subtract(5, "minutes");
    datepicker.end = moment();

    // use passed valuable to update state
    this.daterange.start = moment().subtract(5, "minutes");
    this.daterange.end = moment();
    this.daterange.label = value.label;
  }

  cancel() {
    this.showCustomDates = false;
  }

  setTargets() {
    this.router.navigate(["targets"], { relativeTo: this.route });
  }

  selectOptionClass(option: any): string {
    if (option) {
      switch (+option.value) {
        case enumDepartments.lettings:
          return "fas fa-shipping-fast";
        case enumDepartments.sales:
          return "fas fa-store-alt";
        case enumDepartments.corporate_services:
          return "fas fa-briefcase";
        default:
          break;
      }
    }
  }

  selectRoleClass(option: any): string {
    if (option) {
      switch (+option.value) {
        case LeaderboardRankingViewEnum.ManagerView:
          return "fas fa-user-tie";
        case LeaderboardRankingViewEnum.BrokerView:
          return "fas fa-hand-holding-usd";
        case LeaderboardRankingViewEnum.NegView:
          return "fas fa-people-arrows";
        default:
          break;
      }
    }
  }

  onDateChange(value: Date): void {
    this.bsRangeValue = value;
  }

  getCustomDate() {
    if (this.bsRangeValue) {
      console.log(this.bsRangeValue, "custom date");
      let customDate = this.periodService.getInterval(
        PeriodsEnum.Custom,
        this.bsRangeValue[0],
        this.bsRangeValue[1]
      );
      console.log({ customDate });

      this.showCustomDates = false;
    }
  }
}
