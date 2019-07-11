import { Component, OnInit, OnChanges, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { AddressAutoCompleteData, SharedService } from '../services/shared.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { AppConstants } from '../shared/app-constants';
import { Person } from '../models/person';
import { Company } from 'src/app/contactgroups/shared/contact-group';
import { Address } from '../models/address';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() personDetails: Person;
  @Input() companyDetails: Company;
  @Output() addressDetails = new EventEmitter<any>();
  foundAddress: AddressAutoCompleteData;
  defaultCountryCode = 232;
  addressForm: FormGroup;
  listInfo: any;
  countries: any;
  enterAddressManually = false;
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
    this.init();
  }

  ngOnChanges() {
    this.init()
  }

  init() {
    this.listInfo = this.sharedService.dropdownListInfo;
    this.countries = this.listInfo.result.countries;
    this.addressForm = this.fb.group({
      fullAddress: [''],
      addressLines: ['', {validators: Validators.maxLength(500)}],
      countryId: 0,
      postCode: ['', {validators: [Validators.minLength(5), Validators.maxLength(8), Validators.pattern(AppConstants.postCodePattern)]}],
    });
    if (this.companyDetails || this.personDetails) {
      this.populateAddressForm(this.personDetails, this.companyDetails);
    }
    this.addressForm.valueChanges
    .subscribe((data) => {
      console.log('data from form', data);
      if (data.postCode) {
        this.postCode.setValue(this.sharedService.formatPostCode(data.postCode), { emitEvent: false });
      }
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
          if (x.Type !== 'Address') {
            x.Action = 'View all';
            this.searchTermBK = searchTerm;
          }
        }
      });
      this.foundAddress = data;
      this.isLoadingAddressVisible = false;
    });
  }
  private retrieveAddress(id: string) {
    console.log('retrieve');
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
          addressLines: (retrievedAddress.Company ? retrievedAddress.Company + '\n' : '') + retAddressLines + retrievedAddress.City,
          postCode: retrievedAddress.PostalCode
        });
        this.emitAddress();
        setTimeout(() => {
          document.getElementById('addressLines').scrollIntoView({block: 'center'});
        });
      });
    }
  }

  private emitAddress() {
    const addressData = this.addressForm.value;
    if (addressData) {
      const address = {
        addressLines: addressData.addressLines,
        postCode: addressData.postCode,
        countryId: addressData.countryId
      };
      this.addressDetails.emit(address);
    }
  }

  populateAddressForm(person?: Person, company?: Company) {
    if (this.addressForm) {
      this.addressForm.reset();
    }
   if(this.personDetails) {
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
   } else {
      this.companyDetails = company;
      if (company.companyAddress.postCode) {
        company.companyAddress.postCode = company.companyAddress.postCode.trim();
      }
      this.addressForm.patchValue({
          addressLines: company.companyAddress.addressLines,
          postCode: company.companyAddress.postCode,
          countryId: company.companyAddress.countryId,
          country: company.companyAddress.country,
      });
   }
   this.emitAddress();
  }
}
