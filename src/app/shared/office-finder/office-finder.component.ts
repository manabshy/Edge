import { Component, OnInit, Input, Output, EventEmitter, OnChanges, ViewChild, AfterViewInit } from '@angular/core';
import { Office } from '../models/staff-member';
import { StorageMap } from '@ngx-pwa/local-storage';
import { OfficeService } from 'src/app/core/services/office.service';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { ResultData } from '../result-data';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';
import { MultiSelect } from 'primeng/multiselect';
@Component({
  selector: 'app-office-finder',
  templateUrl: './office-finder.component.html',
  styleUrls: ['./office-finder.component.scss']
})
export class OfficeFinderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() officeId: number;
  @Input() officeIds: number[];
  @Input() fullWidth: boolean;
  @Input() readOnly: boolean;
  @Input() isMultiSelect = false;
  @Input() isRequired = false;
  @Output() selectedOfficeId = new EventEmitter<number>();
  @Output() selectedOfficeIdList = new EventEmitter<number[]>();

  offices$ = new Observable<Office[]>();
  officeFinderForm: FormGroup;
  isInvisible: boolean;
  isClearable = true;
  @ViewChild('multiSelect') multiSelect: MultiSelect;
  offices: Office[] = [];

  constructor(private fb: FormBuilder, private officeService: OfficeService, private storage: StorageMap) { this.getOffices(); }

  ngOnInit(): void {
    this.officeFinderForm = this.fb.group({ officeId: [''], officeIds: [''] });

    this.populateForm();
    this.getOffices();
  }

  ngOnChanges() {
    this.populateForm();
  }

  ngAfterViewInit(): void {
    this.multiSelect?.updateLabel();
    // const selectedOffices = this.offices.filter(x => this.officeIds.includes(x.officeId));
    // console.log({selectedOffices});

    // this._options = val;
    // this.updateLabel();
    // this.updateFilledState();
    // this.checkSelectionLimit();
    // this.cd.markForCheck();
  }

  private populateForm() {
    if (this.officeFinderForm) {
      if (this.officeId) {
        this.officeFinderForm.patchValue({ officeId: this.officeId });
      } else { this.officeFinderForm.get('officeId').setValue(null); }

      if (this.officeIds) {
        this.officeIds = [...this.officeIds];
        this.officeFinderForm.patchValue({ officeIds: this.officeIds });
      } else { this.officeFinderForm.get('officeIds').setValue(null); }
    }
  }

  updateTypeLabel() {
    if (this.officeIds?.length === 1) {
      const label = this.offices[this.officeIds[0]]?.name;
      this.multiSelect.valuesAsString = label;
      this.multiSelect.updateLabel();
    }
  }

  private getOffices() {
    this.storage.get('offices').subscribe(data => {
      if (data) {
        this.offices = data as Office[];
        this.updateTypeLabel();
      } else {
        this.officeService.getOffices()
          .pipe((map(response => response as ResultData),
            tap(res => {
              if (res) { this.offices = res.result; this.updateTypeLabel(); }
            }))).subscribe(); // Remove subscripton
      }
    });
  }

  onOfficeIdsSelected(event: any) {
    if (event?.value?.length) {
      this.selectedOfficeIdList.emit(event?.value);
    } else {
      this.selectedOfficeIdList.emit([]);
    }
    // this.officeFinderForm.patchValue({ officeId: this.officeId });
  }

  onOfficeChange(event: any) {
    if (event?.value) {
      this.officeId = event?.value;
      this.selectedOfficeId.emit(this.officeId);
      console.log({ event });

    } else {
      this.officeId = 0;
      this.selectedOfficeId.emit(0);
    }
    // this.officeFinderForm.patchValue({ officeId: this.officeId });
  }
}
