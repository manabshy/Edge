import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { tap, catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { StaffMember } from 'src/app/core/models/staff-member';
import { AppUtils } from 'src/app/core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';



@Component({
  selector: 'app-staffmember-finder',
  templateUrl: './staffmember-finder.component.html',
  styleUrls: ['./staffmember-finder.component.scss']
})
export class StaffmemberFinderComponent implements OnInit {

  @Output() ownerChanged = new EventEmitter();
  suggestions: (text$: Observable<any>) => Observable<any>;
  suggestedTerm: any;
  searchTerm = '';
  noSuggestions = false;
  storage: any;
  staffMembers: StaffMember[];
  formatter = (x: { fullName: string }) => x.fullName;
  selectedOwner: StaffMember;
  ownerForm: FormGroup;


  constructor(private staffMemberService: StaffMemberService, private fb: FormBuilder) { }


  ngOnInit() {

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.staffMemberService.getStaffMemberSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            }))));

    this.ownerForm = this.fb.group({
      ownerId: ''
    });

    this.ownerForm.patchValue({
      ownerId: this.selectedOwner
    });


    this.onChanges();

  }

  onChanges(): void {
    this.ownerForm.valueChanges.subscribe(val => {
      if (val.ownerId === '') {
        this.ownerChanged.emit(null);
      }
    });
  }

  inputFormatBandListValue(value: any) {
    if (value.fullName) {
      return value.fullName;
    }
    return value;
  }

  resultFormatBandListValue(value: any) {
    return value.fullName;
  }

  onKeyup(event: KeyboardEvent) {
    if (event.key !== 'Enter') {

    }
    AppUtils.searchTerm = this.searchTerm;
  }

  selectedSuggestion(event: any) {
    this.ownerForm.patchValue({
      ownerId: this.selectedOwner
    });
    this.ownerChanged.emit(event);
  }


}
