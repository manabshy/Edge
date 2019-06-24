import { Component, OnInit } from '@angular/core';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUtils } from '../shared/utils';
import { ContactGroupAutoCompleteResult, BasicContactGroup, ContactGroup } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-signer',
  templateUrl: './signer.component.html',
  styleUrls: ['./signer.component.scss']
})
export class SignerComponent implements OnInit {
  signerFinderForm: FormGroup;
  selectedSigner: ContactGroup;
  signers: ContactGroupAutoCompleteResult[];
  isLoading: boolean;
  isMessageVisible: boolean;
  isHintVisible: boolean;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.signerFinderForm = this.fb.group({
      searchTerm: [''],
    });
    this.signerFinderForm.valueChanges.subscribe(data => {
      console.log('characters entered', data.searchTerm);
      this.signersAutocomplete(data.searchTerm);
    });
    if (this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm ){
      this.signersAutocomplete(this.route.snapshot.queryParamMap.get('searchTerm') || AppUtils.searchTerm );
    }
  }

  signersAutocomplete(searchTerm: string) {
    this.isLoading = true;
    this.contactGroupService.getAutocompleteContactGroups(searchTerm).subscribe(result => {
        this.signers = result;
        this.isLoading = false;
        console.log('signers here',this.signers);

        if (this.signerFinderForm.value.searchTerm && this.signerFinderForm.value.searchTerm.length) {
          if (!this.signers.length) {
            this.isMessageVisible = true;
          } else {
            this.isMessageVisible = false;
          }
        }

      }, error => {
        this.signers = [];
        this.isLoading = false;
        this.isHintVisible = true;
      });
  }

  selectSigner(id: number){

  }
  onKeyup() {
    AppUtils.searchTerm = this.signerFinderForm.value.searchTerm;

    if (this.signerFinderForm.value.searchTerm && this.signerFinderForm.value.searchTerm.length > 2) {
      this.isHintVisible = false;
    } else {
      if (this.signers && !this.signers.length) {
        this.isHintVisible = true;
      }
    }
  }

}
