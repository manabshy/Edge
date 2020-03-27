import { Component, Input, Output, EventEmitter, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { BaseStaffMember } from '../shared/models/base-staff-member';
import { StaffMemberService } from '../core/services/staff-member.service';
import { Observable, of, merge, empty } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { CalendarView } from './shared/calendar-shared';
import { StaffMember } from '../shared/models/staff-member';
import { Router, ActivatedRoute } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-calendar-header',
  templateUrl: './calendar-header.component.html',
  styleUrls: ['./calendar-header.component.scss']
})
export class CalendarHeaderComponent implements OnInit, OnChanges {

  @Input() view: CalendarView | 'month' | 'week' | 'threeDays' | 'day';
  @Input() viewDate: Date;
  @Input() locale = 'en';
  @Input() weekStartsOn;
  @Input() daysInWeek;
  @Input() myCalendarOnly: boolean;
  @Output() viewChange: EventEmitter<string> = new EventEmitter();
  @Output() viewDateChange: EventEmitter<Date> = new EventEmitter();
  @Output() filterChange: EventEmitter<boolean> = new EventEmitter();
  @Output() dateChange: EventEmitter<Date> = new EventEmitter();
  @Output() staffMemberChange: EventEmitter<number> = new EventEmitter();
  @ViewChild('datepickerDropdown') private datepickerDropdown: BsDropdownDirective;
  label: string;
  excludeDays = [];
  diaryHeaderForm: FormGroup;
  staffMembers$ = new Observable<BaseStaffMember[]>();
  fakeView: string;
  currentStaffMember: any;
  staffMemberId: number;

  get isShowMeVisible() {
    if (this.diaryHeaderForm && this.currentStaffMember) {
      return +this.diaryHeaderForm.get('staffMember').value !== this.currentStaffMember.staffMemberId;
    }
  }

  constructor(private fb: FormBuilder,
    private storage: StorageMap,
    private router: Router,
    private route: ActivatedRoute,
    private staffMemberService: StaffMemberService) { }

  ngOnInit() {
    this.diaryHeaderForm = this.fb.group({
      viewMode: this.view,
      showCancelled: false,
      staffMember: null,
      dateFilter: this.viewDate
    });

    this.storage.get('currentUser').subscribe((data: StaffMember) => {
      if (data) {
        this.currentStaffMember = data;
        if (this.diaryHeaderForm.get('staffMember').value === 0) {
          this.patchForm(this.currentStaffMember.staffMemberId);
        }
      }
    });

    this.route.queryParams.subscribe(params => {
      this.staffMemberId = +params['staffMemberId'] || 0;
      if (this.staffMemberId) {
        this.patchForm(this.staffMemberId);
      } else {
        const currentStaffMemberId = this.currentStaffMember ? this.currentStaffMember.staffMemberId : 0;
        this.patchForm(currentStaffMemberId);
      }
    });



    this.getStaffMembersForCalendar();
  }

  private patchForm(id: number) {
    this.diaryHeaderForm.patchValue({
      staffMember: id
    });
  }

  ngOnChanges() {
    if (this.view && this.diaryHeaderForm) {
      this.diaryHeaderForm.patchValue({
        viewMode: this.view
      })
      this.getLabel();
      this.diaryHeaderForm.patchValue({ 
        dateFilter: this.viewDate
      }, {emitEvent: false, onlySelf: true}) 
    }
  }

  getStaffMembersForCalendar() {
    this.storage.get('calendarStaffMembers').subscribe(staffMembers => {
      if (staffMembers) {
        this.staffMembers$ = of(staffMembers as BaseStaffMember[]);
      } else {
        this.staffMembers$ = this.staffMemberService.getStaffMembersForCalendar();
      }
    });
  }

  getCurrentStaffMemberCalendar() {
    this.staffMemberChange.emit(this.currentStaffMember.staffMemberId);
    this.diaryHeaderForm.patchValue({
      staffMember: this.currentStaffMember.staffMemberId
    })
    this.router.navigate(['/'],
      {
        queryParams: { isCalendarSelected: true, staffMemberId: this.currentStaffMember.staffMemberId },
        queryParamsHandling: 'merge'
      })
  }

  onStaffMemberChange(staffMember: BaseStaffMember) {
    this.staffMemberChange.emit(staffMember.staffMemberId);
    this.router.navigate(['/'],
      {
        queryParams: { isCalendarSelected: true, staffMemberId: staffMember.staffMemberId },
        queryParamsHandling: 'merge'
      })
    console.log('staff member Id', staffMember.staffMemberId);
  }

  getLabel() {
    switch (this.view) {
      case 'day':
        this.label = 'Today';
        break;
      case 'month':
        this.label = 'This Month';
        break;
      default:
        this.fakeView = 'week';
        this.label = 'This Week';
    }
  }

  onDateChange(date){
    if(date!=this.viewDate){  
      this.dateChange.emit(date)
    }
    if(!this.datepickerDropdown.isOpen){
      this.datepickerDropdown.hide();
    }
  }

  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
        const { cell, isHovered } = hoverEvent;

        if ((isHovered &&
          !!navigator.platform &&
          /iPad|iPhone|iPod/.test(navigator.platform)) &&
          'ontouchstart' in window
        ) {
            (this.datepickerDropdown as any)._datepickerRef.instance.daySelectHandler(cell);
        }

        return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
}
}
