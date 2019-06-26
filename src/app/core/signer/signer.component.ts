import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppUtils } from '../shared/utils';
import { ContactGroupAutoCompleteResult, BasicContactGroup, ContactGroup, Signer } from 'src/app/contactgroups/shared/contact-group';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-signer',
  templateUrl: './signer.component.html',
  styleUrls: ['./signer.component.scss']
})
export class SignerComponent implements OnInit {
  @Output() selectedSigner = new EventEmitter<Signer>();
  signerFinderForm: FormGroup;
  selectedSignerDetails: Signer;
  signers: Signer[];
  isLoading: boolean;
  isMessageVisible: boolean;
  isHintVisible: boolean;
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.signerFinderForm = this.fb.group({
      searchTerm: [''],
    });
    this.signerFinderForm.valueChanges.pipe(debounceTime(400)).subscribe(data => {
      console.log('characters entered', data.searchTerm);
      this.signersAutocomplete(data.searchTerm);
    });
  }

  signersAutocomplete(searchTerm: string) {
    this.isLoading = true;
    this.contactGroupService.getAutocompleteSigners(searchTerm).subscribe(result => {
        this.signers = result;
        this.isLoading = false;
        console.log('signers here', this.signers);
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

  selectSigner(id: number) {
    this.selectedSignerDetails = this.signers.find(x => x.contactGroupId === id);
    if (this.selectedSignerDetails) {
      this.signerFinderForm.get('searchTerm').setValue(this.selectedSignerDetails.contactNames);
      this.selectedSigner.emit(this.selectedSignerDetails);
    }
    console.log('selected signer ', this.selectedSignerDetails.contactNames);
    console.log('selected signer id', id);
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
