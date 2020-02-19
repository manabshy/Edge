import { Component, OnInit, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Office } from '../models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { OfficeService } from 'src/app/core/services/office.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ResultData } from '../result-data';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'app-office-finder',
  templateUrl: './office-finder.component.html',
  styleUrls: ['./office-finder.component.scss']
})
export class OfficeFinderComponent implements OnInit, OnChanges {
  @Input() officeId: number;
  @Input() fullWidth: boolean;
  @Input() readOnly: boolean;
  @Output() selectedOfficeId = new EventEmitter<number>();
  offices$ = new Observable<Office[]>();
  officeFinderForm: FormGroup;
  isInvisible: boolean;

  constructor(private officeService: OfficeService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.officeFinderForm = new FormGroup({
      officeId: new FormControl()
    });
    this.populateForm();
    this.getOffices();
  }

  ngOnChanges() {
    this.populateForm();
  }

  private populateForm() {
    if (this.officeFinderForm) {
      if (this.officeId) {
        console.log('office id', this.officeId);
        this.officeFinderForm.patchValue({ officeId: this.officeId });
      } else {
        this.officeFinderForm.get('officeId').setValue(null);
      }
    }
  }

  private getOffices() {
    this.storage.get('offices').subscribe(data => {
      if (data) {
        this.offices$ = of(data as Office[]);
      } else {
        this.officeService.getOffices()
          .pipe((map(response => response as ResultData),
            tap(res => {
              if (res) { this.offices$ = of(res.result); }
            }))).subscribe();
      }
    });
  }

  onOfficeChange(office: Office) {
    if (office) {
      console.log('selected office', office);
      this.selectedOfficeId.emit(office.officeId);
    } else {
      this.selectedOfficeId.emit(0);
    }
  }
}
