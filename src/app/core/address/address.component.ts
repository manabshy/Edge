import { Component, OnInit, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import { AddressAutoCompleteData, SharedService } from '../services/shared.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from '../shared/app-constants';
import { Person } from '../models/person';
import { Company } from 'src/app/contactgroups/shared/contact-group';
import { Property } from 'src/app/property/shared/property';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit {
  @Input() personDetails: Person;
  @Input() propertyDetails: Property;
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
              private fb: FormBuilder,
              private renderer: Renderer2,
             ) { }

  ngOnInit() {
    this.init();
  }

  ngOnChanges() {
    this.init();
  }

  init() {
    // this.listInfo = this.sharedService.dropdownListInfo;
    this.sharedService.getDropdownListInfo().subscribe(data => {
      this.listInfo = data;
      this.countries = this.listInfo.result.countries;
    });
    this.addressForm = this.fb.group({
      fullAddress: [''],
      addressLines: ['', {validators: Validators.maxLength(500)}],
      countryId: 0,
      addressLine2: [''],
      flatNumber: [''],
      houseNumber: [''],
      houseBuildingName: [''],
      streetName: [''],
      town: [''],
      postCode: ['', {validators: [Validators.minLength(5), Validators.maxLength(8), Validators.pattern(AppConstants.postCodePattern)]}],
    });
    if (this.companyDetails || this.personDetails || this.propertyDetails) {
      this.populateAddressForm(this.personDetails, this.companyDetails, this.propertyDetails);
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

  private emitAddress() {
    const addressData = this.addressForm.value;
    let address;
    if (addressData) {
        if(!this.propertyDetails) {
          address = {
          addressLines: addressData.addressLines,
          postCode: addressData.postCode,
          countryId: addressData.countryId
        }
      } else {
        address = {
          addressLine2: addressData.addressLine2,
          flatNumber: addressData.flatNumber,
          houseNumber: addressData.houseNumber,
          houseBuildingName: addressData.houseBuildingName,
          streetName: addressData.streetName,
          town: addressData.town,
          postCode: addressData.postCode
        }
      }
      this.addressDetails.emit(address);
    }
  }

  populateAddressForm(person?: Person, company?: Company, property?: Property) {
    if (this.addressForm) {
      this.addressForm.reset();
    }

    switch(true) {
      case !!this.personDetails:
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
        break;
      case !!this.companyDetails:
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
        break;
      case !!this.propertyDetails:
      this.propertyDetails = property;
      this.addressForm.patchValue({
        addressLine2: property.address.addressLine2,
        flatNumber: property.address.flatNumber,
        houseNumber: property.address.houseNumber,
        houseBuildingName: property.address.houseBuildingName,
        streetName: property.address.streetName,
        town: property.address.town,
        postCode: property.address.inCode + ' ' + property.address.outCode,
        countryId: 232
    });
    }
   this.emitAddress();
  }
}
