import { AfterViewInit, ViewChild } from '@angular/core';
import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { StorageMap } from '@ngx-pwa/local-storage';
import { MultiSelect } from 'primeng/multiselect';
import { map, tap } from 'rxjs/operators';
import { DropdownListInfo, InfoDetail, InfoService } from 'src/app/core/services/info.service';
import { AppUtils } from 'src/app/core/shared/utils';

@Component({
  selector: 'app-lead-type-finder',
  templateUrl: './lead-type-finder.component.html',
  styleUrls: ['./lead-type-finder.component.scss']
})
export class LeadTypeFinderComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() leadTypeId: number;
  @Input() leadTypeIds: number[];
  @Input() fullWidth: boolean;
  @Input() readOnly: boolean;
  @Input() isMultiSelect = false;
  @Input() isRequired = false;
  @Output() selectedLeadTypeId = new EventEmitter<number>();
  @Output() selectedLeadTypeIdList = new EventEmitter<number[]>();

  leadTypeFinderForm: FormGroup;
  leadTypes: InfoDetail[] = [];

  @ViewChild('multiSelect') multiSelect: MultiSelect;

  constructor(private fb: FormBuilder, private infoService: InfoService, private storage: StorageMap) { this.getLeadTypes(); }

  ngOnInit(): void {
    this.leadTypeFinderForm = this.fb.group({ leadTypeId: [''], leadTypeIds: [''] });

    this.populateForm();
    this.getLeadTypes();
  }

  ngOnChanges() {
    this.populateForm();
  }

  ngAfterViewInit(): void {
    console.log(this.multiSelect, 'multi select in lead types');
    this.multiSelect?.updateLabel();
  }

  private populateForm() {
    if (this.leadTypeFinderForm) {
      if (this.leadTypeId) {
        this.leadTypeFinderForm.patchValue({ leadTypeId: this.leadTypeId });
      } else { this.leadTypeFinderForm.get('leadTypeId').setValue(null); }

      if (this.leadTypeIds) {
        this.leadTypeFinderForm.patchValue({ leadTypeIds: this.leadTypeIds });
      } else { this.leadTypeFinderForm.get('leadTypeIds').setValue(null); }
    }
  }

  updateTypeLabel() {
    if (this.leadTypeIds?.length === 1) {
      const label = this.leadTypes[this.leadTypeIds[0]]?.value;
      this.multiSelect.valuesAsString = label;
      console.log('value as string', this.multiSelect.valuesAsString, { label });
      this.multiSelect.updateLabel();
    }
  }

  private getLeadTypes() {
    this.storage.get('info').subscribe((data: DropdownListInfo) => {
      if (data) {
        this.leadTypes = data.leadTypes;
        console.log('lead yptes', this.leadTypes);
        this.updateTypeLabel();
      } else {
        this.infoService.getDropdownListInfo()
          .pipe((map(response => response),
            tap(res => {
              if (res) { this.leadTypes = res.leadTypes; this.updateTypeLabel(); }
            }))).subscribe();
      }
    });
  }

  onLeadIdsSelected(event: any) {
    console.log({ event });

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
