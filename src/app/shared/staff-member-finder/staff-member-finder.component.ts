import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  OnDestroy,
} from "@angular/core";
import { Observable, Subscription } from "rxjs";
import { BaseStaffMember } from "../models/base-staff-member";
import { StorageMap } from "@ngx-pwa/local-storage";
import { StaffMemberService } from "src/app/core/services/staff-member.service";
import { FormGroup, FormControl } from "@angular/forms";
import { ResultData } from "../result-data";
import { OfficeMember } from "src/app/valuations/shared/valuation";
import { StaffMember } from "../models/staff-member";
import { SelectItem, SelectItemGroup } from "primeng/api";
import { DashboardMember } from "../models/dashboard-member";
import _ from "lodash";
import { SharedService } from "src/app/core/services/shared.service";

@Component({
  selector: "app-staff-member-finder",
  templateUrl: "./staff-member-finder.component.html",
  styleUrls: ["./staff-member-finder.component.scss"],
})
export class StaffMemberFinderComponent
  implements OnInit, OnChanges, OnDestroy
{
  @Input() staffMember: BaseStaffMember;

  private _staffMemberId: number;
  dashboardMembers: DashboardMember[];
  @Input() set staffMemberId(value: number) {
    this._staffMemberId = value;
  }
  get staffMemberId(): number {
    return this._staffMemberId;
  }

  private _deparmentId: number;
  @Input() set deparmentId(value: number) {
    if (value != this._deparmentId) {
      this._deparmentId = value;
      this.staffMemberService
        .getDashboardMembers(this.currentStaffMember, +this._deparmentId)
        .subscribe((res) => {
          this.setListToGroupMembers(res);
        });
    }
  }
  get deparmentId(): number {
    return this._deparmentId;
  }

  @Input() staffMemberIdList: number[];
  @Input() listType: string;
  @Input() isDisabled: boolean;
  @Input() isRequired: boolean;
  @Input() isMultiple: boolean;
  @Input() isDashboardMember: boolean = false;
  @Input() isReadOnly = false;
  @Input() isFullStaffMember = false;
  @Input() placeholder = "Select Staff Member";
  @Input() label: string;
  @Input() valuers: OfficeMember[];
  @Input() isSalesAndLettings: boolean;
  @Output() selectedStaffMember = new EventEmitter<BaseStaffMember>();
  @Output() selectedStaffMemberId = new EventEmitter<number>();
  @Output() selectedStaffMemberList = new EventEmitter<
    BaseStaffMember[] | any
  >();
  staffMembers$ = new Observable<any>();
  staffMemberFinderForm: FormGroup;
  selectedStaffMembers: BaseStaffMember[] = [];
  isClearable = true;
  isValuersPicker = false;
  valuersIds: number[] = [];
  staffMembers: any[] = [];
  subscription = new Subscription();
  currentStaffMember: StaffMember;
  groupedByRolesMembers: SelectItemGroup[] = [];
  dropDownType: string;

  constructor(
    private staffMemberService: StaffMemberService,
    private storage: StorageMap,
    private sharedService: SharedService
  ) {
    this.staffMemberFinderForm = new FormGroup({
      staffMemberId: new FormControl(),
      staffMemberIds: new FormControl(),
      selectedDashboardMember: new FormControl(),
    });

    if (this.isDashboardMember) {
      this.dropDownType = "dashboard";
    } else if (this.isMultiple) {
      this.dropDownType = "multiple";
    } else {
      this.dropDownType = "noMultiple";
    }
    this.getCurrentUserInfo();
  }

  ngOnInit(): void {
    this.getStaffMembers();

    this.subscription =
      this.staffMemberService.clearSelectedStaffMember$.subscribe((res) => {
        if (res) {
          this.staffMemberFinderForm?.reset({
            staffMemberId: null,
            staffMemberIds: null,
          });
        }
      });
  }

  ngOnChanges() {
    if (this.valuers) {
      this.isValuersPicker = true;
    } else {
      this.getStaffMembers(this.listType);
      this.isValuersPicker = false;
    }
    if (this.staffMemberId) {
      this.staffMemberFinderForm.patchValue({
        staffMemberId: this.staffMemberId,
      });
    }
    if (this.staffMemberIdList && this.staffMemberIdList.length) {
      // console.log("staff ids", this.staffMemberIdList);
      this.isClearable = false;
      this.staffMemberFinderForm.patchValue({
        staffMemberId: this.staffMemberIdList,
      });
    }
  }

  onStaffMemberChange(event: any) {
    if (this.isMultiple) {
      const staffMemberIdList: number[] = event?.value;
      let baseStaffMemberList: BaseStaffMember[] = [];
      staffMemberIdList?.forEach((staffMemberId) => {
        baseStaffMemberList.push(
          this.staffMembers?.find((x) => x.staffMemberId === staffMemberId)
        );
      });
      this.selectedStaffMemberList.emit(baseStaffMemberList);
    } else {
      // event?.value ? this.selectedStaffMemberId.emit(event?.value) : this.selectedStaffMemberId.emit(0);
      if (event.value) {
        let staffMember: any;
        if (this.isDashboardMember) {
          let dashboardMember = this.dashboardMembers?.find(
            (x) => x.staffMemberId === +event.value.value
          );
          staffMember = {
            thumbnailUrl: dashboardMember?.photoUrl,
            ...dashboardMember,
          };
        } else {
          staffMember = this.staffMembers?.find(
            (x) => x.staffMemberId === +event.value
          );
        }

        this.isFullStaffMember
          ? this.selectedStaffMember.emit(staffMember)
          : this.selectedStaffMemberId.emit(event?.value);
      } else {
        this.selectedStaffMember.emit(null);
        this.selectedStaffMemberId.emit(0);
      }
    }
  }

  private getStaffMembers(listType?: string) {
    switch (listType) {
      case "allValuers":
        this.getAllValuers();
        break;
      case "dashboardMembers":
        this.getDashboardMembers();
        break;
      default:
        this.getActiveStaffMembers();
    }
  }

  getActiveStaffMembers() {
    this.storage.get("activeStaffmembers").subscribe((data) => {
      if (data) {
        const staffMemberData = data as BaseStaffMember[];
        this.addStaffMemberId(staffMemberData).then(
          (result) => (this.staffMembers = result)
        );
      } else {
        this.staffMemberService
          .getActiveStaffMembers()
          .subscribe((res: ResultData) => {
            this.addStaffMemberId(res.result).then(
              (result) => (this.staffMembers = result)
            );
            // console.log(
            //   "%cmembers from shared replay",
            //   "color:green",
            //   res.result
            // );
          });
      }
    });
  }

  private getCurrentUserInfo() {
    this.storage.get("currentUser").subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
      } else {
        this.staffMemberService
          .getCurrentStaffMember()
          .subscribe((res) => (this.currentStaffMember = res));
      }
    });
  }

  getAllCalendarStaffMembers() {
    this.storage.get("calendarStaffMembers").subscribe((data) => {
      if (data) {
        const staffMemberData = data as BaseStaffMember[];
        this.addStaffMemberId(staffMemberData).then(
          (result) => (this.staffMembers = result)
        );
      } else {
        this.staffMemberService
          .getStaffMembersForCalendar()
          .subscribe((res) => (this.staffMembers = res));
      }
    });
  }

  private getDashboardMembers() {
    this.storage.get("dashboardMembers").subscribe((data) => {
      if (data) {
        const staffMemberData = data as DashboardMember[];
        this.setListToGroupMembers(staffMemberData);
      } else {
        this.staffMemberService
          .getDashboardMembers(this.currentStaffMember, this.deparmentId)
          .subscribe((res) => {
            this.setListToGroupMembers(res);
          });
      }
    });
  }

  setListToGroupMembers(data: DashboardMember[]) {
    this.groupedByRolesMembers = [];
    if (data && data.length > 0) {
      this.dashboardMembers = data;
      const grouped = this.sharedService.groupBy(data, "roleName");
      // console.log(grouped);

      const roles = Object.keys(grouped);
      // console.log(roles);

      for (var role of roles) {
        if (role == "CEO") continue;
        const groupMembers: DashboardMember[] = grouped[role];
        const values: SelectItem[] = [];
        for (var group of groupMembers) {
          values.push({
            label: group.staffMemberFullName,
            value: group.staffMemberId,
            icon: group.photoUrl,
            title: role,
          });
        }
        const item: SelectItemGroup = {
          label: role,
          items: values,
        };
        // console.log(groupMembers);
        this.groupedByRolesMembers.push(item);
      }
    }
  }

  private getAllValuers() {
    this.storage.get("allListers").subscribe((data) => {
      if (data) {
        const staffMemberData = data as BaseStaffMember[];
        this.addStaffMemberId(staffMemberData).then(
          (result) => (this.staffMembers = result)
        );
      } else {
        this.staffMemberService.getValuers().subscribe((res) => {
          this.addStaffMemberId(res).then(
            (result) => (this.staffMembers = result)
          );
        });
      }
    });
  }

  async addStaffMemberId(staffMembers?: any[]): Promise<any[]> {
    if (
      staffMembers &&
      staffMembers.length > 0 &&
      this.staffMemberId &&
      this.staffMemberId > 0 &&
      !staffMembers.some((x) => x.staffMemberId == this.staffMemberId)
    ) {
      await this.staffMemberService
        .getAllStaffMembers()
        .toPromise()
        .then((res) => {
          const allStaffMembers = res.result;
          const selectedStaffMember = allStaffMembers.find(
            (x) => x.staffMemberId == this.staffMemberId
          );
          if (selectedStaffMember && selectedStaffMember.staffMemberId > 0)
            staffMembers.push(selectedStaffMember);
        });
    }
    return staffMembers;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
