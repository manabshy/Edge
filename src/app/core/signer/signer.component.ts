import { Component, OnInit, OnChanges, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { AppUtils } from '../shared/utils';
import { ContactGroupAutoCompleteResult, BasicContactGroup, ContactGroup, Signer } from 'src/app/contactgroups/shared/contact-group';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-signer',
  templateUrl: './signer.component.html',
  styleUrls: ['./signer.component.scss']
})
export class SignerComponent implements OnInit, OnChanges {
  @Output() selectedSigner = new EventEmitter<Signer>();
  @Output() newSigner = new EventEmitter<boolean>();
  @Input() existingSigner: Signer;
  @Input() createdSigner: Signer;
  @Input() label: string;
  @ViewChild('selectedSignerInput', { static: true }) selectedSignerInput: ElementRef;
  @ViewChild('searchSignerInput', { static: true }) searchSignerInput: ElementRef;
  signerFinderForm: FormGroup;
  selectedSignerDetails: Signer;
  signers: Signer[];
  isLoading: boolean;
  isMessageVisible: boolean;
  isHintVisible: boolean;
  isSearchVisible: boolean = true;
  get signerNames(): FormControl {
    if (this.signerFinderForm) {
      return <FormControl>this.signerFinderForm.get('selectedSigner');
    }
  }
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.signerFinderForm = this.fb.group({
      searchTerm: [''],
      selectedSigner: [''],
    });
    this.displayExistingSigners();
  }

  ngOnChanges() {
    this.displayExistingSigners();
  }

  private displayExistingSigners() {
    let signer: Signer;
    this.createdSigner ? signer = this.createdSigner : signer = this.existingSigner;
    console.log('new or existing signer.....', signer);
    if (signer && this.signerFinderForm) {
      let displayName: string;
      const names = signer.contactNames;
      const namesWithCompany = signer.contactNames + ' (' + signer.companyName + ')';
      signer.companyName ? displayName = namesWithCompany : displayName = names;
      this.signerNames.setValue(displayName);
      this.selectedSignerDetails = signer;
      this.isSearchVisible = false;
      this.selectedSigner.emit(this.selectedSignerDetails);
    }
  }


  searchSigner() {
    event.preventDefault();
    event.stopPropagation();
    const searchTerm = this.signerFinderForm.get('searchTerm').value;
    this.signersAutocomplete(searchTerm);
  }

  signersAutocomplete(searchTerm: string) {
    this.isLoading = true;
    this.contactGroupService.getAutocompleteSigners(searchTerm).subscribe(result => {
      this.signers = result;
      this.isLoading = false;
      console.log('signers here', this.signers);
    }, error => {
      this.signers = [];
      this.isLoading = false;
      this.isHintVisible = true;
    });
  }

  selectSigner(id: number) {
    this.selectedSignerDetails = this.signers.find(x => x.contactGroupId === id);
    this.isSearchVisible = false;
    if (this.selectedSignerDetails) {
      this.signers = null;
      let displayName: string;
      const names = this.selectedSignerDetails.contactNames;
      const namesWithCompany = this.selectedSignerDetails.contactNames + ' (' + this.selectedSignerDetails.companyName + ')';
      this.selectedSignerDetails.companyName ? displayName = namesWithCompany : displayName = names;
      this.signerFinderForm.get('selectedSigner').setValue(displayName);
      this.selectedSigner.emit(this.selectedSignerDetails);
      setTimeout(()=>{
        this.selectedSignerInput.nativeElement.scrollIntoView({block: 'center'});
      })
    }
    console.log('selected signer ', this.selectedSignerDetails.contactNames);
    console.log('selected  signer company name', this.selectedSignerDetails.companyName);
    console.log('selected signer id', id);
  }

  resetSearch() {
    this.signerFinderForm.reset();
  }

  toggleSearch() {
    event.preventDefault();
    this.isSearchVisible = !this.isSearchVisible;
    setTimeout(()=>{
      this.searchSignerInput.nativeElement.focus();
    })
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

  createNewSigner() {
    this.newSigner.emit(true);
  }

}
