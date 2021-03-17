import { Component, EventEmitter, Input, OnChanges, OnInit, Output, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormErrors, ValidationMessages } from '../../../app/core/shared/app-constants';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { PointType, TeamMember, TeamMemberPoint } from '../shared/models/team-member';
import { tap, map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { getYear, getMonth } from 'date-fns';
import { MessageService } from 'primeng/api';

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
  thisYearsMonths: { key: string, value: string }[] = [];
  teamMemberPoints: TeamMemberPoint[] = [];
  totalPoints: number;
  currentMonth: string;
  showAdjustment = false;
  teamMember: TeamMember;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private boardService: CsBoardService,
    private sharedService: SharedService,
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

    this.searchRecord();
    this.recordForm.valueChanges.subscribe(() => this.logValidationErrors(this.recordForm, false));
    this.getTeamMemberDetails();
    this.getPointTypes();
  }

  ngOnChanges() { if (this.member) { this.teamMember = this.member; this.teamMemberPoints = [...this.member.points]; } }

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
    moment.locale('en');
    const months = moment.months();
    const thisYear = getYear(new Date());
    const currentMonthIndex = getMonth(new Date());
    months.forEach(m => {
      const key = `${m} ${thisYear}`;
      const value = `01 ${m} ${thisYear}`;
      this.thisYearsMonths.push({ key, value });
    });
    this.currentMonth = this.thisYearsMonths[currentMonthIndex].value;
  }

  getTeamMemberDetails(dateTime?: string) {
    this.memberDetails$ = this.boardService.getCsTeamMemberDetails(this.teamMemberId, dateTime)
      .pipe(
        tap(data => this.setPointType(data.points)),
        tap(data => {
          this.teamMemberPoints = data.points;
          this.orderPointsByDateDescending(data.points);
          this.getSelectedMonthPointTotal(data.points);
        })
      );
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
              // this.toastr.success('Adjustment successfully added');
              this.showAdjustment = false;
              this.messageService.add({ severity: 'success', summary: 'Adjustment successfully added', closable: false });
              this.clearRecordForm();
              point.dateTime = new Date();
              point.points = +point.points;
              this.updateTeamMemberPoints(point);
              // this.boardService.getCsTeamMemberDetails(this.teamMemberId).subscribe((data)=>console.log({data}));
            }
          }
        });
      }
    }
  }

  cancel() { this.showAdjustment = false; this.clearRecordForm(); }
}
