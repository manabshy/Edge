import { Component, OnInit, Output, Input, EventEmitter, OnChanges } from '@angular/core';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { tap, catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { AppUtils } from 'src/app/core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';



@Component({
  selector: 'app-staffmember-finder',
  templateUrl: './staffmember-finder.component.html',
  styleUrls: ['./staffmember-finder.component.scss']
})
export class StaffmemberFinderComponent implements OnInit, OnChanges {

  @Input() staffMemberId: number;
  @Input() isDisabled: boolean = false;
  @Output() ownerChanged = new EventEmitter();
  suggestions: (text$: Observable<any>) => Observable<any>;
  staffMember: StaffMember;
  suggestedTerm: any;
  searchTerm = '';
  noSuggestions = false;
  staffMembers: StaffMember[];
  formatter = (x: { fullName: string }) => x.fullName;
  ownerForm: FormGroup;
  currentStaffMember: StaffMember;

  constructor(private staffMemberService: StaffMemberService, private fb: FormBuilder, private storage: StorageMap) { }


  ngOnInit() {
    this.ownerForm = this.fb.group({
      owner: ''
    });

    // All Staffmembers
    this.storage.get('allstaffmembers').subscribe(data => {
      if (data) {
        this.staffMembers = data as StaffMember[];
      }
    });
    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.staffMemberService.getStaffMemberSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))));

    this.onChanges();
  }

  ngOnChanges() {
    if (this.staffMembers && this.staffMembers.length && this.staffMemberId !== null) {
      this.staffMember = this.staffMembers.find(sm => sm.staffMemberId === this.staffMemberId);
      this.ownerForm.patchValue({
        owner: this.staffMember
      });
    } else {
      if (this.ownerForm) {
        this.ownerForm.patchValue({
          owner: ''
        });
      }
    }
  }

  onChanges(): void {
    this.ownerForm.valueChanges.subscribe(val => {
      if (val.owner === '') {
        this.ownerChanged.emit(null);
      }
    });
  }

  inputFormatOwnerValue(value: any) {
    if (value.fullName) {
      return value.fullName;
    }
    return value;
  }

  resultFormatOwnerValue(value: any) {
    return value.fullName;
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {

    }
    this.ownerChanged.emit(this.ownerForm.value.owner);
    AppUtils.searchTerm = this.searchTerm;
  }

  selectedSuggestion(event: any) {
    this.ownerChanged.emit(event.item);
  }

}
