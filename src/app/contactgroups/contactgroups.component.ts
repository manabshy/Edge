import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from './shared/contact-groups.service';
import { ContactGroupAutoCompleteResult } from './shared/contact-group';
import { ActivatedRoute } from '@angular/router';
import { AppUtils } from '../core/shared/utils';
import { FormGroup, FormBuilder } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { JsonPipe } from '@angular/common';
import { SharedService } from '../core/services/shared.service';
import { AppConstants } from '../core/shared/app-constants';

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
  differentSearchSuggestions: string[];
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder, private sharedService: SharedService) { }

  ngOnInit() {
    this.contactFinderForm = this.fb.group({
      searchTerm: [''],
    });
    this.contactFinderForm.valueChanges
      .pipe(debounceTime(500), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => {
        // this.contactGroupsAutocomplete(data.searchTerm)
      });

    this.route.queryParams.subscribe(params=>{
      if(params['searchTerm'] || AppUtils.searchTerm) {
        this.contactFinderForm.get('searchTerm').setValue(params['searchTerm'] || AppUtils.searchTerm);
        this.contactGroupsResults();
        this.isHintVisible = false;
        this.isMessageVisible = false;
      }
    })
    
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

  // contactGroupsAutocomplete(searchTerm: string) {
  //   if(searchTerm) {
  //     this.isLoading = true;
  //   }
  //   this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
  //       this.contactGroups = result;
  //       if(this.contactGroups && this.contactGroups.length) {
  //         this.contactGroups.forEach(x => {
  //           x.warning = this.sharedService.showWarning(x.warningStatusId, this.warnings, x.warningStatusComment);
  //         })
  //       }
  //       this.isLoading = false;
  //       console.log('contact groups', this.contactGroups);

  //       if (searchTerm && searchTerm.length) {
  //         if (!this.contactGroups.length) {
  //           this.isMessageVisible = true;
  //           this.getDifferentSearchSuggestions(searchTerm);
  //         } else {
  //           this.isMessageVisible = false;
  //         }
  //       } else {
  //         this.isMessageVisible = false;
  //       }

  //     }, error => {
  //       this.contactGroups = [];
  //       this.isLoading = false;
  //       this.isHintVisible = true;
  //     });
  // }

  contactGroupsResults() {
    const searchTerm = this.contactFinderForm.get('searchTerm').value;
    if(searchTerm) {
      this.isLoading = true;
    }
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
        this.contactGroups = result;
        if(this.contactGroups && this.contactGroups.length) {
          this.contactGroups.forEach(x => {
            x.warning = this.sharedService.showWarning(x.warningStatusId, this.warnings, x.warningStatusComment);
          })
        }
        this.isLoading = false;
        console.log('contact groups', this.contactGroups);

        if (searchTerm && searchTerm.length) {
          if (!this.contactGroups.length) {
            this.isMessageVisible = true;
            this.getDifferentSearchSuggestions(searchTerm);
          } else {
            this.isMessageVisible = false;
          }
        } else {
          this.isMessageVisible = false;
        }

      }, error => {
        this.contactGroups = [];
        this.isLoading = false;
        this.isHintVisible = true;
      });
  }

  getDifferentSearchSuggestions(searchTerm: string) {
    const telIndex = searchTerm.search(AppConstants.telephonePattern);
    this.differentSearchSuggestions = [];
    if(telIndex > 0){
      this.differentSearchSuggestions.push(searchTerm.substring(0, telIndex).trim());
    }
    this.differentSearchSuggestions.push(searchTerm.substring(telIndex).trim());
  }

  onKeyup(event: KeyboardEvent) {
    if(event.key !== 'Enter') {
      this.isMessageVisible = false;
    }
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
