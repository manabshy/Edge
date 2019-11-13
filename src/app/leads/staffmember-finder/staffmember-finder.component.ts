import { Component, OnInit } from '@angular/core';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { tap, catchError, distinctUntilChanged, debounceTime, switchMap, map } from 'rxjs/operators';
import { Observable, EMPTY } from 'rxjs';
import { StaffMember } from 'src/app/core/models/staff-member';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-staffmember-finder',
  templateUrl: './staffmember-finder.component.html',
  styleUrls: ['./staffmember-finder.component.scss']
})
export class StaffmemberFinderComponent implements OnInit {

  suggestions: (text$: Observable<any>) => Observable<any>;
  suggestedTerm: any;
  searchTerm = '';
  noSuggestions = false;
  storage: any;
  staffMembers: StaffMember[];
  formatter = (x: { fullName: string }) => x.fullName;

  constructor(private staffMemberService: StaffMemberService) { }


  ngOnInit() {

    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.staffMemberService.getStaffMemberSuggestions(term).pipe(
            tap(data => console.log('names 1', data)),
            catchError(() => {
              return EMPTY;
            }))));
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
    console.log('search term:', this.searchTerm);

  }

  selectedSuggestion(event) {
    console.log(event.item);

  }

}
