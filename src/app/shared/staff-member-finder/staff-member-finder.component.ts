import { Component, OnInit, Input, Output, EventEmitter, OnChanges, OnDestroy } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BaseStaffMember } from '../models/base-staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { FormGroup, FormControl } from '@angular/forms';
import { ResultData } from '../result-data';
import { OfficeMember } from 'src/app/valuations/shared/valuation';

@Component({
  selector: 'app-staff-member-finder',
  templateUrl: './staff-member-finder.component.html',
  styleUrls: ['./staff-member-finder.component.scss']
})
export class StaffMemberFinderComponent implements OnInit, OnChanges, OnDestroy {
  @Input() staffMember: BaseStaffMember;
  @Input() staffMemberId: number;
  @Input() staffMemberIdList: number[];
  @Input() listType: string;
  @Input() isDisabled: boolean;
  @Input() isRequired: boolean;
  @Input() isMultiple: boolean;
  @Input() isReadOnly = false;
  @Input() isFullStaffMember = false;
  @Input() placeholder = 'Select Staff Member';
  @Input() label: string;
  @Input() valuers: OfficeMember[];
  @Input() isSalesAndLettings: boolean;
  @Output() selectedStaffMember = new EventEmitter<BaseStaffMember>();
  @Output() selectedStaffMemberId = new EventEmitter<number>();
  @Output() selectedStaffMemberList = new EventEmitter<BaseStaffMember[] | any>();
  staffMembers$ = new Observable<any>();
  staffMemberFinderForm: FormGroup;
  selectedStaffMembers: BaseStaffMember[] = [];
  isClearable = true;
  isValuersPicker = false;
  valuersIds: number[] = [];
  staffMembers: any[] = [];
  subscription = new Subscription();

  constructor(private staffMemberService: StaffMemberService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.staffMemberFinderForm = new FormGroup({
      staffMemberId: new FormControl()
    });

    this.getStaffMembers();

    this.subscription = this.staffMemberService.clearSelectedStaffMember$.subscribe(res => {
      if (res) { this.staffMemberFinderForm?.reset({ staffMemberId: null }); }
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
        staffMemberId: this.staffMemberId
      });
    }
    if (this.staffMemberIdList && this.staffMemberIdList.length) {
      console.log('staff ids', this.staffMemberIdList);
      this.isClearable = false;
      this.staffMemberFinderForm.patchValue({
        staffMemberId: this.staffMemberIdList
      });
    }
  }

  onStaffMemberChange(event: any) {
    if (this.isMultiple) {
      event?.value?.length ? this.selectedStaffMemberList.emit(event.value) : this.selectedStaffMemberList.emit([]);
    } else {
      // event?.value ? this.selectedStaffMemberId.emit(event?.value) : this.selectedStaffMemberId.emit(0);
      if (event.value) {
        const staffMember = this.staffMembers?.find(x => x.staffMemberId === +event.value);
        this.isFullStaffMember ? this.selectedStaffMember.emit(staffMember) : this.selectedStaffMemberId.emit(event?.value);
      } else { this.selectedStaffMemberId.emit(0); }
    }
  }

  private getStaffMembers(listType?: string) {
    switch (listType) {
      case 'allValuers':
        this.getAllValuers();
        break;

      default:
        this.getActiveStaffMembers();
    }
  }

  getActiveStaffMembers() {
    this.storage.get('activeStaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as BaseStaffMember[];
      } else {
        this.staffMemberService.getActiveStaffMembers().subscribe(
          (res: ResultData) => {
            this.staffMembers = res.result;
            console.log('%cmembers from shared replay', 'color:green', res.result);
          }
        );
      }
    });
  }

  getAllCalendarStaffMembers() {
    this.storage.get('calendarStaffMembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as BaseStaffMember[];
      } else {
        this.staffMemberService.getStaffMembersForCalendar().subscribe(res => this.staffMembers = res);
      }
    });
  }

  private getAllValuers() {
    this.storage.get('allListers').subscribe(data => {
      if (data) {
        this.staffMembers = data as BaseStaffMember[];
      } else {
        this.staffMemberService.getValuers().subscribe(res => this.staffMembers = res);
      }
    });
  }

  ngOnDestroy() { this.subscription.unsubscribe(); }
}
