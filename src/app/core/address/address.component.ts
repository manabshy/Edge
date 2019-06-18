import { Component, OnInit, Renderer2, Input } from '@angular/core';
import { AddressAutoCompleteData, SharedService } from '../services/shared.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { AppConstants } from '../shared/app-constants';
import { Person } from '../models/person';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() personDetails: Person;
  foundAddress: AddressAutoCompleteData;
  defaultCountryCode = 232;
  addressForm: FormGroup;
  listInfo: any;
  countries: any;
  enterAddressManually: boolean;
  isLoadingAddressVisible: boolean;
  retrievedAddresses: AddressAutoCompleteData;
  backToAddressesList: boolean;
  searchTermBK = '';

  get showPostCode(): boolean {
    return this.addressForm.get('countryId').value == this.defaultCountryCode;
  }
  get fullAddress(): FormControl {
    return <FormControl>this.addressForm.get('fullAddress');
  }
  get addressLines(): FormControl {
    return <FormControl>this.addressForm.get('addressLines');
  }
  get postCode(): FormControl {
    return <FormControl>this.addressForm.get('postCode');
  }
  get countryId(): FormControl {
    return <FormControl>this.addressForm.get('countryId');
  }
  // get address(): FormGroup {
  //   return <FormGroup>this.addressForm.get('address');
  // }
  constructor(private sharedService: SharedService,
              private contactGroupService: ContactGroupsService,
              private fb: FormBuilder,
              private renderer: Renderer2,
             ) { }

  ngOnInit() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.countries = this.listInfo.result.countries;
    this.addressForm = this.fb.group({
      fullAddress: [''],
      addressLines: ['', {validators: Validators.maxLength(500), updateOn: 'blur'}],
      countryId: 0,
      postCode: ['', {validators: [Validators.minLength(5), Validators.maxLength(8), Validators.pattern(AppConstants.postCodePattern)], updateOn: 'blur'}],
    });
    this.addressForm.valueChanges
    .subscribe((data) => {
      this.postCode.setValue(this.sharedService.formatPostCode(data.address.postCode), { emitEvent: false });
      // this.logValidationErrors(this.personForm, false);
      // this.logValidationErrorsFormArray(this.personForm);
    });
  }

  searchAddress() {
    const addressSearchTerm = this.addressForm.get('fullAddress').value;
    this.findAddress(addressSearchTerm, '');
  }

  enterAddress(event) {
    event.preventDefault();
    this.enterAddressManually = true;
    setTimeout(() => {
      this.renderer.selectRootElement('#addressLines').focus();
    });
  }

  findAddress(searchTerm: string, container: string) {
    this.retrievedAddresses = null;
    this.isLoadingAddressVisible = true;

    if (container) {
      this.backToAddressesList = true;
    } else {
      this.backToAddressesList = false;
    }
    this.sharedService.findAddress(searchTerm, container).subscribe(data => {
      data.Items.forEach(x => {
        if (x.Id) {
          if (!x.Id.includes('|B|')) {
            x.Action = 'View all';
            this.searchTermBK = searchTerm;
          }
        }
      });
      this.foundAddress = data;
      this.isLoadingAddressVisible = false;
      console.log('id here', data.Items[0].Id);
      // data.Items.forEach(x=>{
      //   console.log(x.Description);
      //   if(x.Id) {
      //     if(!x.Id.includes('|B|')) {
      //       this.findAddress(searchTerm, x.Id);
      //     }
      //   }
      // });
    });
  }
  private retrieveAddress(id: string) {
    if (this.foundAddress) {
      this.sharedService.getAddress(id).subscribe(data => {
        this.retrievedAddresses = data;
        const retrievedAddress = this.retrievedAddresses.Items[0];
        const keys = Object.keys(retrievedAddress);
        let retAddressLines = '';
        keys.forEach(x => {
          if (x.includes('Line') && retrievedAddress[x]) {
            retAddressLines += retrievedAddress[x] + '\n';
          }
        });

        this.addressForm.patchValue({
          fullAddress: '',
          address: {
            addressLines: (retrievedAddress.Company ? retrievedAddress.Company + '\n' : '') + retAddressLines + retrievedAddress.City,
            postCode: retrievedAddress.PostalCode
          }
        });
        setTimeout(() => {
          document.getElementById('addressLines').scrollIntoView({block: 'center'});
        });
      });
    }
  }

  populateAddressForm(person: Person) {
    if (this.addressForm) {
      this.addressForm.reset();
    }
    this.personDetails = person;
    if (person.address.postCode) {
      person.address.postCode = person.address.postCode.trim();
    }
    this.addressForm.patchValue({
        addressLines: person.address.addressLines,
        postCode: person.address.postCode,
        countryId: person.address.countryId,
        country: person.address.country,
    });
  }
}
