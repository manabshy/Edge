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
  @Input() officeIds: any;
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


  constructor(private officeService: OfficeService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.officeFinderForm = new FormGroup({
      officeId: new FormControl(),
      officeIds: new FormControl(),
    });
    this.populateForm();
    this.getOffices();

    console.log('form in init', this.officeFinderForm?.value);

  }

  ngOnChanges() {
    this.populateForm();
    console.log('form in onchanges', this.officeFinderForm?.value);
  }

  private populateForm() {
    if (this.officeFinderForm) {
      if (this.officeId) {
        console.log('office id in finder', this.officeId);
        this.officeFinderForm.patchValue({ officeId: this.officeId });
      } else {
        this.officeFinderForm.get('officeId').setValue(null);
      }
      if (this.officeIds) {
        console.log('office ids in finder', this.officeIds);
        this.officeId = this.officeIds;
        this.officeFinderForm.patchValue({ officeIds: this.officeId });
      } else {
        this.officeFinderForm.get('officeIds').setValue(null);
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
