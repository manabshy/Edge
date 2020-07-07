import { Component, OnInit, TemplateRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-admin-panel-details',
  templateUrl: './admin-panel-details.component.html',
  styleUrls: ['./admin-panel-details.component.scss']
})
export class AdminPanelDetailsComponent implements OnInit {

  modalRef: BsModalRef;
  searchForm: FormGroup;
  recordForm: FormGroup;
  constructor(private fb: FormBuilder, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.searchForm = this.fb.group({ searchTerm: ['0'] });
    this.recordForm = this.fb.group({
      date: [''],
      target: [''],
      reason: [''],
      points: ['']
    });

    this.searchRecord();

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

  addRecord() {
    console.log('add record');
  }

}
