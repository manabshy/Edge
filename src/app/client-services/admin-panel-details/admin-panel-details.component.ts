import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormErrors, ValidationMessages } from '../../../app/core/shared/app-constants';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { PointType, TeamMemberPoint } from '../shared/models/team-member';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';
import { getYear } from 'date-fns';

@Component({
  selector: 'app-admin-panel-details',
  templateUrl: './admin-panel-details.component.html',
  styleUrls: ['./admin-panel-details.component.scss']
})
export class AdminPanelDetailsComponent implements OnInit {

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

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private boardService: CsBoardService,
    private sharedService: SharedService,
    private toastr: ToastrService,
    public modalService: BsModalService) { }

  ngOnInit(): void {
    this.teamMemberId = +this.route.snapshot.paramMap.get('id');
    this.searchForm = this.fb.group({ searchTerm: ['current'] });
    this.recordForm = this.fb.group({
      reason: ['', Validators.required],
      points: ['', Validators.required]
    });

    this.getMonths();
    this.searchRecord();
    this.recordForm.valueChanges.subscribe(() => this.logValidationErrors(this.recordForm, false));
    this.getTeamMemberDetails();
    this.getPointTypes();
  }

  getPointTypes() {
    this.boardService.getPointTypes().subscribe({
      next: (data: any) => this.pointTypes = data
    });
  }

  setPointType(points: TeamMemberPoint[]) {
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

  updateTeamMemberPoints(newPoint: TeamMemberPoint) {
    if (newPoint) {
      this.teamMemberPoints.push(newPoint);
      this.getSelectedMonthPointTotal(this.teamMemberPoints);
    }
  }

  getSelectedMonthPointTotal(points: TeamMemberPoint[]) {
    let total = 0;
    points.forEach(x => {
      total += x.points;
    });
    this.totalPoints = total;
    console.log('sum of points', total);
  }

  getMonths() {
    moment.locale('en');
    const months = moment.months();
    const thisYear = getYear(new Date());
    months.forEach(m => {
      const key = `${m} ${thisYear}`;
      const value = `01 ${m} ${thisYear}`;
      this.thisYearsMonths.push({ key, value });
    });
  }

  getTeamMemberDetails(dateTime?: string) {
    this.memberDetails$ = this.boardService.getCsTeamMemberDetails(this.teamMemberId, dateTime)
      .pipe(
        tap(data => this.setPointType(data.points)),
        tap(data => {
          this.teamMemberPoints = data.points;
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
      this.recordForm.reset();
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
    point.staffMemberId = this.teamMemberId;
    point.pointTypeId = 9;

    if (this.recordForm.valid) {
      if (this.recordForm.dirty) {
        this.boardService.addPoint(point).subscribe({
          next: (res: boolean) => {
            if (res) {
              this.toastr.success('Adjustment successfully added');
              this.modalRef.hide();
              this.clearRecordForm();
              point.dateTime = new Date();
              point.points = +point.points;
              this.updateTeamMemberPoints(point);
            }
          }
        });
      }
    }
  }

}
