import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { map, tap } from 'rxjs/operators';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';

@Component({
  selector: 'app-lead-type-finder',
  templateUrl: './lead-type-finder.component.html',
  styleUrls: ['./lead-type-finder.component.scss']
})
export class LeadTypeFinderComponent implements OnInit, OnChanges {
  @Input() leadTypeId: number;
  @Input() fullWidth: boolean;
  @Input() readOnly: boolean;
  @Input() isMultiSelect = false;
  @Input() isRequired = false;
  @Output() selectedLeadTypeId = new EventEmitter<number>();
  @Output() selectedLeadTypeIdList = new EventEmitter<number[]>();

  leadTypeFinderForm: FormGroup;
  leadTypes: InfoDetail[];

  constructor(private infoService: InfoService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.leadTypeFinderForm = new FormGroup({
      leadTypeId: new FormControl(),
      leadTypeIds: new FormControl(),
    });
    this.populateForm();
    this.getLeadTypes();
  }

  ngOnChanges() {
    this.populateForm();
  }

  private populateForm() {
    if (this.leadTypeFinderForm) {
      if (this.leadTypeId) {
        console.log('lead type id in finder', this.leadTypeId);
        this.leadTypeFinderForm.patchValue({ leadTypeId: this.leadTypeId });
      } else {
        this.leadTypeFinderForm.get('leadTypeId').setValue(null);
      }
    }
  }

  private getLeadTypes() {
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.leadTypes = data.leadTypes;
      } else {
        this.infoService.getDropdownListInfo()
          .pipe((map(response => response),
            tap(res => {
              if (res) { this.leadTypes = res.leadTypes; }
            }))).subscribe();
      }
    });
  }

  onLeadIdsSelected(event: any) {
    if (event?.value?.length) {
      this.selectedLeadTypeIdList.emit(event?.value);
    } else {
      this.selectedLeadTypeIdList.emit([]);
    }
  }

  onLeadTypeIdChange(event: any) {
    if (event?.value) {
      this.leadTypeId = event?.value;
      this.selectedLeadTypeId.emit(this.leadTypeId);
      console.log({ event });

    } else {
      this.leadTypeId = 0;
      this.selectedLeadTypeId.emit(0);
    }
  }

}
