import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from '../core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

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
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.contactFinderForm = this.fb.group({
      searchTerm: [''],
    });
    this.contactFinderForm.valueChanges.pipe(debounceTime(400)).subscribe(data => {
      this.contactGroupsAutocomplete(data.searchTerm);
    });
    if(this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm ){
      this.contactGroupsAutocomplete(this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm );
    }
  }

  contactGroupsAutocomplete(searchTerm: string) {
    this.isLoading = true;
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
        this.contactGroups = result;
        this.isLoading = false;
        console.log('contact groups',this.contactGroups);

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
