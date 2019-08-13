import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from '../core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { SharedService } from '../core/services/shared.service';

@Component({
  selector: 'app-contactgroups',
  templateUrl: './contactgroups.component.html',
  styleUrls: ['./contactgroups.component.scss']
})
export class ContactGroupsComponent implements OnInit {
  advSearchCollapsed = false;
  isMessageVisible = false;
  isHintVisible = false;
  isLoading = false;
  contactFinderForm: FormGroup;
  contactGroups: ContactGroupAutoCompleteResult[];
  contactGroupDetails: ContactGroupAutoCompleteResult[];
  contactPeople: any[];
  contactGroupId: number;
  listInfo: any;
  warnings: any;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder, private sharedService: SharedService) { }

  ngOnInit() {
    this.contactFinderForm = this.fb.group({
      searchTerm: [''],
    });
    this.contactFinderForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => this.contactGroupsAutocomplete(data.searchTerm));

    if (this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm ) {
      this.contactGroupsAutocomplete(this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm );
    }
    
    if(AppUtils.listInfo) {
      this.listInfo = AppUtils.listInfo;
      this.setDropdownLists();
    } else {
      this.sharedService.getDropdownListInfo().subscribe(data=> {
        this.listInfo = data;
        this.setDropdownLists();
      });
    }
  }

  setDropdownLists() {
    this.warnings = this.listInfo.result.personWarningStatuses;
  }

  contactGroupsAutocomplete(searchTerm: string) {
    this.isLoading = true;
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
        this.contactGroups = result;
        this.contactGroups.forEach(x => {
          x.warning = this.sharedService.showWarning(x.warningStatusId, this.warnings, x.warningStatusComment);
        })
        this.isLoading = false;
        console.log('contact groups', this.contactGroups);

        if (this.contactFinderForm.value.searchTerm && this.contactFinderForm.value.searchTerm.length) {
          if (!this.contactGroups.length) {
            this.isMessageVisible = true;
          } else {
            this.isMessageVisible = false;
          }
        }

      }, error => {
        this.contactGroups = [];
        this.isLoading = false;
        this.isHintVisible = true;
      });
  }

  onKeyup() {
    AppUtils.searchTerm = this.contactFinderForm.value.searchTerm;

    if (this.contactFinderForm.value.searchTerm && this.contactFinderForm.value.searchTerm.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.contactGroups && !this.contactGroups.length) {
        this.isHintVisible = true;
      }
    }
  }


}
