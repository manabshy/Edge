import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { PointType } from '../../models/team-member';
import { CsBoardService } from '../../services/cs-board.service';

@Component({
  selector: 'app-rules',
  templateUrl: './rules.component.html',
  styleUrls: ['./rules.component.scss']
})
export class RulesComponent implements OnInit {
  pointTypes: PointType[] = [];
  rulesForm: FormGroup;
  selectedPointTypes: PointType[] = [];

  get pointTypesControl(): FormArray {
    return this.rulesForm?.get('pointTypes') as FormArray
  }

  constructor(private boardService: CsBoardService, private fb: FormBuilder,   private toastr: ToastrService,) { }

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
    let selected = {
      pointTypeId: this.pointTypes[index].pointTypeId,
      points: this.pointTypes[index].points = +value,
    } as PointType

    let existIndex = this.selectedPointTypes?.findIndex(p => p.pointTypeId === selected?.pointTypeId)
    if (existIndex !== -1) {
      this.selectedPointTypes[existIndex] = selected;
    } else {
      this.selectedPointTypes.push(selected);
    }
  }

  saveRules(){
    this.boardService.updatePointTypes(this.selectedPointTypes).subscribe(res=>{
      if(res){
        this.pointTypes = res;
        this.toastr.success('Rule(s) successfully changed!');
        console.log({res})
      }
    })
  }
}
