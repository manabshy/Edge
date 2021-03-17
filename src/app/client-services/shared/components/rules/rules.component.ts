import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormGroup, FormArray, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MessageService } from 'primeng/api';
import { SharedService } from 'src/app/core/services/shared.service';
import { PointType } from '../../models/team-member';
import { CsBoardService } from '../../services/cs-board.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {

  @Output() hideModal = new EventEmitter<boolean>();
  pointTypes: PointType[] = [];
  rulesForm: FormGroup;
  selectedPointTypes: PointType[] = [];
  isSubmitting = false;

  get pointTypesControl(): FormArray {
    return this.rulesForm?.get('pointTypes') as FormArray;
  }

  constructor(private boardService:
    CsBoardService, private fb: FormBuilder,
    private messageService: MessageService,
    private toastr: ToastrService, private sharedService: SharedService) { }

  ngOnInit() {
    this.getPointTypes();
    this.setupForm();
  }

  private setupForm() {
    this.rulesForm = this.fb.group({ pointTypes: this.addControls() });
  }

  addControls(): FormArray {
    let control = this.pointTypes?.map(el => this.fb.control(el.points));
    return this.fb.array(control);
  }

  getPointTypes() {
    this.boardService.getPointTypes().subscribe((data) => {
      if (data) {
        this.pointTypes = data;
        this.setupForm();
      }
    });
  }

  getSelected(index: number, value: string) {
    this.rulesForm.markAsDirty();
    const selected = {
      pointTypeId: this.pointTypes[index].pointTypeId,
      points: this.pointTypes[index].points = +value,
    } as PointType;

    const existIndex = this.selectedPointTypes?.findIndex(p => p.pointTypeId === selected?.pointTypeId);
    if (existIndex !== -1) {
      this.selectedPointTypes[existIndex] = selected;
    } else {
      this.selectedPointTypes.push(selected);
    }
  }

  saveRules() {
    this.isSubmitting = true;
    this.boardService.updatePointTypes(this.selectedPointTypes).subscribe(res => {
      if (res) {
        this.pointTypes = res;
        this.messageService.add({ severity: 'success', summary: 'Rule(s) successfully changed', closable: false });
        this.isSubmitting = false;
        this.hideModal.emit();
      }
    });
  }

  canDeactivate(): boolean {
    if (this.rulesForm.dirty && !this.isSubmitting) {
      return false;
    }
    return true;
  }

  cancel() {
    this.canDeactivate();
    this.hideModal.emit();
  }

}
