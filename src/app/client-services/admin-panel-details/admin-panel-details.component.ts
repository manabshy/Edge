import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormErrors, ValidationMessages } from '../../../app/core/shared/app-constants';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { PointType, TeamMember, TeamMemberPoint } from '../shared/models/team-member';
import { tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { MessageService } from 'primeng/api';
import { StorageMap } from '@ngx-pwa/local-storage';
import { addYears, eachMonthOfInterval, getMonth, getYear, subYears, format, compareDesc } from 'date-fns';

@Component({
  selector: 'app-admin-panel-details',
  templateUrl: './admin-panel-details.component.html',
  styleUrls: ['./admin-panel-details.component.scss']
})
export class AdminPanelDetailsComponent implements OnInit, OnChanges {

  @Input() member: TeamMember;
  @Output() updatedTeamMember = new EventEmitter<TeamMember>();
  // @Input() teamMemberId: number;
  modalRef: BsModalRef;
  searchForm: FormGroup;
  recordForm: FormGroup;
  teamMemberId: number;
  formErrors = FormErrors;
  memberDetails$ = new Observable<any>();
  pointTypes: PointType[];
  monthsYears: { key: string, value: string }[] = [];
  teamMemberPoints: TeamMemberPoint[] = [];
  totalPoints: number;
  currentMonth: string;
  showAdjustment = false;
  teamMember: TeamMember;
  message: string;

  get searchTermControl(): FormControl {
    return this.searchForm.get('searchTerm') as FormControl;
  }
  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private boardService: CsBoardService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private toastr: ToastrService,
    private messageService: MessageService,
    public modalService: BsModalService) { }

  ngOnInit(): void {
    this.getMonths();
    this.teamMemberId = +this.route.snapshot.paramMap.get('id');
    this.searchForm = this.fb.group({ searchTerm: [this.currentMonth] });
    this.recordForm = this.fb.group({
      reason: ['', Validators.required],
      points: ['', Validators.required]
    });

    // this.searchRecord();
    this.recordForm.valueChanges.subscribe(() => this.logValidationErrors(this.recordForm, false));
    if (this.member) {
      this.getTeamMemberDetails();
    }
    this.getPointTypes();
  }

  ngOnChanges() {
    if (this.member) {
      this.teamMember = this.member;
      this.teamMemberPoints = [...this.member.points];
      this.searchForm.patchValue({ searchTerm: this.currentMonth });
    }
  }

  getPointTypes() {
    this.boardService.getPointTypes().subscribe({
      next: (data: any) => this.pointTypes = data
    });
  }

  setPointType(points: TeamMemberPoint[]) {
    console.log('href or pont type');

    if (points && points.length) {
      points.forEach((p, i) => {
        if (this.pointTypes && this.pointTypes.length) {
          p.type = this.pointTypes
            .filter(x => x.pointTypeId === p.pointTypeId)
            .map(x => x.name).toString();
        }
      });
    }
  }

  orderPointsByDateDescending(points: TeamMemberPoint[]) {
    points?.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

  }

  updateTeamMemberPoints(newPoint: TeamMemberPoint) {
    if (newPoint) {
      this.teamMemberPoints.push(newPoint);
      this.getSelectedMonthPointTotal(this.teamMemberPoints);
      this.orderPointsByDateDescending(this.teamMemberPoints);
      this.teamMember.points = this.teamMemberPoints;
      this.updatedTeamMember.emit(this.teamMember);
      this.searchForm.patchValue({ searchTerm: this.currentMonth });
    }
  }

  getSelectedMonthPointTotal(points: TeamMemberPoint[]) {
    let total = 0;
    if (points) {
      points.forEach(x => {
        total += x.points;
      });
      this.totalPoints = total;
      this.teamMember.totalPoints = total;
    }
  }

  getMonths() {
    const thisYear = getYear(new Date());
    const thisMonth = format(new Date(), 'MMMM');
    const current = `${thisMonth} ${thisYear}`;

    const dates = eachMonthOfInterval({ start: subYears(new Date(), 2), end: new Date() });
    dates.sort(compareDesc).forEach(d => {
      const item = { key: format(d, 'MMMM yyyy'), value: format(d, 'yyyy/MM/dd') };
      this.monthsYears.push(item);
    });

    this.currentMonth = this.monthsYears?.find(x => x.key === current)?.value;

  }

  getTeamMemberDetails(dateTime?: string) {
    this.boardService.getCsTeamMemberDetails(this.member?.staffMemberId, dateTime)
      .pipe(
        tap(data => this.setPointType(data.points)),
        tap(data => {
          this.teamMember.points = data.points;
          this.updatedTeamMember.emit(this.teamMember);
          this.orderPointsByDateDescending(data.points);
          this.getSelectedMonthPointTotal(data.points);
          data?.points?.length ? this.message = '' : this.message = 'No points';
        })
      ).subscribe();
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  searchRecord() {
    this.searchForm.valueChanges.subscribe(input => {
      if (input && input.searchTerm) {
        this.getTeamMemberDetails(input.searchTerm);
      }
    });
  }

  onDateChanged() {
    if (this.searchTermControl.value) {
      this.getTeamMemberDetails(this.searchTermControl.value);
    }
  }

  clearRecordForm() {
    if (this.recordForm) {
      this.recordForm?.reset();
      this.clearFormValidators();
    }
  }

  clearFormValidators() {
    Object.keys(this.recordForm.controls).forEach(key => {
      this.formErrors[key] = '';
    });
  }

  logValidationErrors(group: FormGroup = this.recordForm, fakeTouched: boolean) {
    Object.keys(group.controls).forEach((key: string) => {
      const control = group.get(key);
      const messages = ValidationMessages[key];
      if (control.valid) {
        FormErrors[key] = '';
      }
      if (control && !control.valid && (fakeTouched || control.dirty)) {
        FormErrors[key] = '';
        for (const errorKey in control.errors) {
          if (errorKey) {
            FormErrors[key] += messages[errorKey] + '\n';
          }
        }
      }
      if (control instanceof FormGroup) {
        this.logValidationErrors(control, fakeTouched);
      }
    });
    this.sharedService.scrollToFirstInvalidField();
  }

  addRecord() {
    this.logValidationErrors(this.recordForm, true);
    const point = this.recordForm.value as TeamMemberPoint;
    point.staffMemberId = this.member.staffMemberId;
    point.pointTypeId = 9;

    if (this.recordForm.valid) {
      if (this.recordForm.dirty) {
        this.boardService.addPoint(point).subscribe({
          next: (res: boolean) => {
            if (res) {
              this.showAdjustment = false;
              this.messageService.add({ severity: 'success', summary: 'Adjustment successfully added', closable: false });
              this.clearRecordForm();
              point.dateTime = new Date();
              point.points = +point.points;
              this.updateTeamMemberPoints(point);
              // this.storage.delete('adminPanelBoard').subscribe();
            }
          }
        });
      }
    }
  }

  cancel() { this.showAdjustment = false; this.clearRecordForm(); }
}
