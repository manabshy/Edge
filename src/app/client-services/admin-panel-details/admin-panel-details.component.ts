import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { FormErrors, ValidationMessages } from '../../../app/core/shared/app-constants';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { PointType, TeamMemberPoint } from '../shared/models/team-member';

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
  record$ = new Observable<any>();
  pointTypes: PointType[];
  points$: Observable<TeamMemberPoint[]>;

  constructor(private fb: FormBuilder,
    private route: ActivatedRoute,
    private boardService: CsBoardService,
    private sharedService: SharedService,
    private modalService: BsModalService) { }

  ngOnInit(): void {
    this.teamMemberId = +this.route.snapshot.paramMap.get('id');
    this.searchForm = this.fb.group({ searchTerm: ['0'] });
    this.recordForm = this.fb.group({
      recordDate: ['', Validators.required],
      pointType: ['0', Validators.required],
      reason: ['', Validators.required],
      points: ['', Validators.required]
    });

    this.searchRecord();
    this.recordForm.valueChanges.subscribe(() => this.logValidationErrors(this.recordForm, false));
    this.getTeamMemberDetails();
    this.getPointTypes();
    if(this.teamMemberId) {
      this.getTeamMemberPoints();
    }
  }

  private getTeamMemberPoints() {
    this.points$ = this.boardService.getCsTeamMemberPoints(this.teamMemberId);
  }

   getPointTypes() {
    this.boardService.getPointTypes().subscribe({
      next: (data: any) => {this.pointTypes = data; console.log('pontypes', data);}
    });
  }

  getTeamMemberDetails() {
    this.record$ = this.boardService.getCsTeamMemberDetails(this.teamMemberId);
  }

  openModal(template: TemplateRef<any>) {
    this.modalRef = this.modalService.show(template);
  }

  searchRecord() {
    this.searchForm.valueChanges.subscribe(input => {
      if (input) {
        console.log('search term', input.searchTerm);
      }
    });
  }

  populatePointFields(pointTypeId: number) {
    if (pointTypeId) {
      const pointType = this.pointTypes.find(x => x.pointTypeId === +pointTypeId);
      console.log('point type', pointType);
      if (pointType) {
        this.recordForm.get('reason').setValue(pointType.name);
        this.recordForm.get('points').setValue(pointType.points);
      } else {
        this.recordForm.get('reason').setValue(null);
        this.recordForm.get('points').setValue(null);
      }
    }
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
    console.log('add record');
    this.logValidationErrors(this.recordForm, true);
    const record = this.recordForm.value;
    if (this.recordForm.valid) {
      if (this.recordForm.dirty) {
        this.boardService.addRecord(record).subscribe();
      }
    } else {
      console.log('invalid form');
    }
  }

}
