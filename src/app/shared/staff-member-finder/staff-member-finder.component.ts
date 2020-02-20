import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BaseStaffMember } from '../models/base-staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-staff-member-finder',
  templateUrl: './staff-member-finder.component.html',
  styleUrls: ['./staff-member-finder.component.scss']
})
export class StaffMemberFinderComponent implements OnInit, OnChanges {
  @Input() staffMember: BaseStaffMember;
  @Input() staffMemberId: number;
  @Input() listType: string;
  @Input() isDisabled: boolean;
  @Input() isRequired: boolean;
  @Input() isMultiple: boolean;
  @Output() selectedStaffMemberId = new EventEmitter<number>();
  staffMembers$ = new Observable<any>();
  staffMemberFinderForm: FormGroup;
  constructor(private staffMemberService: StaffMemberService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.staffMemberFinderForm = new FormGroup({
      staffMemberId: new FormControl()
    });

    this.getStaffMembers();
  }

  ngOnChanges() {
    console.log('is multiple', this.isMultiple);

    if (this.staffMemberId) {
      this.staffMemberFinderForm.patchValue({
        staffMemberId: this.staffMemberId
      });
    }
    this.getStaffMembers(this.listType);
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    if (staffMember) {
      this.selectedStaffMemberId.emit(staffMember.staffMemberId);
      console.log('selected', staffMember);
    } else {
      this.selectedStaffMemberId.emit(0);
    }
    console.log('value of selected id control', this.staffMemberFinderForm.get('staffMemberId').value);
  }

  private getStaffMembers(listType?: string) {
    switch (listType) {
      case 'allValuers':
        this.getAllValuers();
        break;
      case 'allStaffMembers':
        this.getAllStaffMembers();
        break;
    }
  }

  getAllStaffMembers() {
    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers$ = of(data as BaseStaffMember[]);
      } else {
        this.staffMemberService.getAllStaffMembers().subscribe(res => this.staffMembers$ = of(res));
      }
    });
  }

  private getAllValuers() {
    this.storage.get('allListers').subscribe(data => {
      if (data) {
        this.staffMembers$ = of(data as BaseStaffMember[]);
      } else {
        this.staffMemberService.getValuers().subscribe(res => this.staffMembers$ = of(res));
      }
    });
  }
}
