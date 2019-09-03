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
  @Input() existingSigner: Signer;
  @Input() label: string;
  @ViewChild('searchTermInput') searchTermInput: ElementRef;
  signerFinderForm: FormGroup;
  selectedSignerDetails: Signer;
  signers: Signer[];
  isLoading: boolean;
  isMessageVisible: boolean;
  isHintVisible: boolean;
  searchTermBK = '';
  get signerNames(): FormControl {
    if (this.signerFinderForm) {
      return <FormControl> this.signerFinderForm.get('searchTerm');
    }
  }
  constructor(private contactGroupService: ContactGroupsService, private route: ActivatedRoute, private fb: FormBuilder) { }

  ngOnInit() {
    this.signerFinderForm = this.fb.group({
      searchTerm: [''],
    });
    this.displayExistingSigners();
    this.signerFinderForm.valueChanges
      .pipe(debounceTime(1000), distinctUntilChanged((a, b) => JSON.stringify(a) === JSON.stringify(b)))
      .subscribe(data => this.signersAutocomplete(data.searchTerm));
  }

  ngOnChanges() {
    this.displayExistingSigners();
  }

  private displayExistingSigners() {
    if (this.existingSigner && this.signerFinderForm) {
      console.log('existing.....', this.existingSigner);
      let displayName: string;
      const names = this.existingSigner.contactNames;
      const namesWithCompany = this.existingSigner.contactNames + ' (' + this.existingSigner.companyName + ')';
      this.existingSigner.companyName ? displayName = namesWithCompany : displayName = names;
      this.signerNames.setValue(displayName);
      this.selectedSignerDetails = this.existingSigner;
      this.selectedSigner.emit(this.selectedSignerDetails);
    }
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
    if (this.selectedSignerDetails) {
      let displayName: string;
      const names = this.selectedSignerDetails.contactNames;
      const namesWithCompany = this.selectedSignerDetails.contactNames + ' (' + this.selectedSignerDetails.companyName + ')';
      this.selectedSignerDetails.companyName ? displayName = namesWithCompany : displayName = names;
      this.searchTermBK = this.signerFinderForm.get('searchTerm').value;
      this.signerFinderForm.get('searchTerm').setValue(displayName);
      this.selectedSigner.emit(this.selectedSignerDetails);
      this.searchTermInput.nativeElement.scrollIntoView({block: 'center'});
    }
    console.log('selected signer ', this.selectedSignerDetails.contactNames);
    console.log('selected  signer company name', this.selectedSignerDetails.companyName);
    console.log('selected signer id', id);
  }

  initSearch() {
    this.selectedSignerDetails = null;
    if(this.signerFinderForm.get('searchTerm').value){
      this.signerFinderForm.get('searchTerm').setValue(this.searchTermBK);
    }
    this.selectedSigner.emit(null);
  }

  resetSearch() {
    this.signerFinderForm.reset();
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
