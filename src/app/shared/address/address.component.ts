import { Component, OnInit, Renderer2, Input, Output, EventEmitter, OnChanges, ElementRef } from '@angular/core';
import { SharedService } from '../../core/services/shared.service';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppConstants } from '../../core/shared/app-constants';
import { Person } from '../models/person';
import { Company } from 'src/app/contact-groups/shared/contact-group.interfaces';
import { Property } from 'src/app/property/shared/property';
import { Address } from '../models/address';
import { debounceTime } from 'rxjs/operators';
import { AddressService, AddressAutoCompleteData } from '../../core/services/address.service';
import { InfoService } from '../../core/services/info.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import * as _ from 'lodash';

@Component({
  selector: 'app-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss']
})
export class AddressComponent implements OnInit, OnChanges {
  @Input() personDetails: Person;
  @Input() propertyDetails: Property;
  @Input() isNewProperty: boolean;
  @Input() isRequired = false;
  @Input() isCheckingDuplicateProperties = false;
  @Input() companyDetails: Company;
  @Input() companyAddress: Address;
  @Input() addressError: any;
  @Input() searchedAddress: string;
  @Output() addressDetails = new EventEmitter<any>();
  @Output() checkDuplicateProperties = new EventEmitter<boolean>();
  foundAddress: AddressAutoCompleteData;
  defaultCountryCode = 232;
  addressForm: FormGroup;
  listInfo: any;
  countries: any;
  enterAddressManually = false;
  retrievedAddresses: AddressAutoCompleteData;
  backToAddressesList: boolean;
  searchTermBK = '';

  get showPostCode(): boolean {
    return +this.addressForm.get('countryId').value === this.defaultCountryCode;
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

  constructor(private sharedService: SharedService,
    private addressService: AddressService,
    private infoService: InfoService,
    private storage: StorageMap,
    private fb: FormBuilder,
    private renderer: Renderer2,
    private _host: ElementRef
  ) { }

  ngOnInit() {
    this.init();

  }

  ngOnChanges() {
    // this.init(); TODO: Check asap
  }

  init() {
    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.setDropdownLists();
      }
    });

    this.addressForm = this.fb.group({
      fullAddress: [this.searchedAddress, Validators.required],
      addressLines: ['', { validators: Validators.maxLength(500) }],
      countryId: this.defaultCountryCode,
      addressLine2: [''],
      flatNumber: [''],
      houseNumber: [''],
      houseBuildingName: [''],
      streetName: [''],
      town: [''],
      postCode: ['', { validators: [Validators.minLength(5), Validators.maxLength(8), Validators.pattern(AppConstants.postCodePattern)] }],
    });
    if (this.companyDetails || this.personDetails || this.propertyDetails || this.companyAddress) {
      this.populateAddressForm(this.personDetails, this.companyDetails, this.propertyDetails, this.companyAddress);
    }

    if (this.searchedAddress) {
      this.searchAddress();
    }

    Object.keys(this.addressForm.controls).forEach(key => {
      this.addressForm.get(key).valueChanges.pipe(debounceTime(500))
        .subscribe((data) => {
          if (key === 'postCode') {
            this.postCode.setValue(this.sharedService.formatPostCode(data), { emitEvent: false });
          }
          if (key !== 'fullAddress') {
            if (this.isCheckingDuplicateProperties) {
              if (key === 'postCode') {
                this.checkDuplicateProperties.emit(true);
              } else { this.checkDuplicateProperties.emit(false); }
            }
            this.emitAddress();
          }
        });
    });
  }

  setDropdownLists() {
    if (this.listInfo) {
      this.countries = this.listInfo.countries;
    }
  }

  searchAddress() {
    const addressSearchTerm = this.addressForm.get('fullAddress').value;
    if (addressSearchTerm) {
      this.findAddress(addressSearchTerm, '');
    }
  }

  enterAddress(event) {
    event.preventDefault();
    this.enterAddressManually = true;
    this.foundAddress = null;
    setTimeout(() => {
      if (!(this.propertyDetails || this.isNewProperty)) {
        this.renderer.selectRootElement('#addressLines').focus();
      } else {
        this.renderer.selectRootElement('#flatNumber').focus();
      }
    });
  }

  findAddress(searchTerm: string, container: string) {
    this.retrievedAddresses = null;

    if (container) {
      this.backToAddressesList = true;
    } else {
      this.backToAddressesList = false;
    }
    this.addressService.findAddress(searchTerm, container).subscribe(data => {
      data.Items.forEach(x => {
        if (x.Id) {
          if (x.Type !== 'Address') {
            x.Action = 'View all';
            this.searchTermBK = searchTerm;
          }
        }
      });
      this.foundAddress = data;
      if (this.foundAddress) {
        const closestParent = this._host.nativeElement.closest('.off-canvas-content');
        if (closestParent) {
          closestParent.scrollTo(0, 0);
          this.renderer.addClass(closestParent, 'no-scroll');
        }
      }
    });
  }

  retrieveAddress(id: string) {
    if (this.foundAddress) {
      this.addressService.getAddress(id).subscribe(data => {
        this.hideOffCanvas();
        this.retrievedAddresses = data;
        const retrievedAddress = this.retrievedAddresses.Items[0];
        const keys = Object.keys(retrievedAddress);
        let retAddressLines = '';
        keys.forEach(x => {
          if (x.includes('Line') && retrievedAddress[x]) {
            retAddressLines += retrievedAddress[x] + '\n';
          }
        });
        if (!(this.isNewProperty || this.propertyDetails)) {
          this.addressForm.patchValue({
            fullAddress: '',
            addressLines: (retrievedAddress.Company ? retrievedAddress.Company + '\n' : '') + retAddressLines + retrievedAddress.City,
            postCode: retrievedAddress.PostalCode,
            countryId: this.defaultCountryCode
          });
        } else {
          const buildingInfo = retrievedAddress.BuildingName.split(' ');
          const lastItem = buildingInfo.length - 1;
          let buildingNumber: string;
          if (this.hasNumber(buildingInfo[lastItem])) {
            buildingNumber = buildingInfo[lastItem];
            retrievedAddress.BuildingName = buildingInfo.slice(1, buildingInfo.length - 1).join(' ');
          }
          if (this.hasNumber(buildingInfo[0])) {
            retrievedAddress.BuildingNumber = buildingInfo[0];
            retrievedAddress.BuildingName = buildingInfo.slice(1, buildingInfo.length).join(' ');
          }
          if (!retrievedAddress.BuildingName && !this.hasNumber(retrievedAddress.SubBuilding)) {
            retrievedAddress.BuildingName = retrievedAddress.SubBuilding;
            retrievedAddress.SubBuilding = '';
          }
          this.addressForm.patchValue({
            flatNumber: retrievedAddress.SubBuilding.replace(/flat/gi, '').trim(),
            houseNumber: retrievedAddress.BuildingNumber || buildingNumber,
            houseBuildingName: retrievedAddress.BuildingName,
            streetName: retrievedAddress.Street,
            town: retrievedAddress.City,
            postCode: retrievedAddress.PostalCode
          });
        }

        if (this.isNewProperty || this.propertyDetails) {
          this.propertyDetails = this.addressForm.value;
        }
        setTimeout(() => {
          let element = 'addressLines';
          if (this.propertyDetails) {
            element = 'flatNumber';
          }
          document.getElementById(element).scrollIntoView({ block: 'center' });
        });
      });
    }
  }

  hideOffCanvas() {
    this.foundAddress = null;
    const closestParent = this._host.nativeElement.closest('.off-canvas-content');
    if (closestParent) {
      this.renderer.removeClass(closestParent, 'no-scroll');
    }
  }

  private hasNumber(number: string) {
    return /\d/.test(number);
  }

  private emitAddress() {
    const addressData = this.addressForm.value;
    let address;
    if (addressData) {
      if (!(this.isNewProperty || this.propertyDetails)) {
        address = {
          addressLines: addressData.addressLines,
          postCode: addressData.postCode,
          countryId: addressData.countryId
        };
        if (!address.addressLines) {
          address = {
            addressLines: '',
            postCode: '',
            countryId: this.defaultCountryCode
          };
        }

      } else {
        address = {
          addressLine2: addressData?.addressLine2,
          flatNumber: addressData?.flatNumber,
          houseNumber: addressData?.houseNumber,
          houseBuildingName: addressData?.houseBuildingName,
          streetName: addressData?.streetName,
          town: addressData?.town,
          postCode: addressData?.postCode
        };
      }
      this.addressDetails.emit(address);
      console.log({ address }, 'addresss new list');
    }

  }

  sendAddress() {
    this.emitAddress();
  }

  populateAddressForm(person?: Person, company?: Company, property?: Property, companyAddress?: Address) {
    if (this.addressForm) {
      this.addressForm.reset();
    }

    switch (true) {
      case !!this.personDetails:
        this.patchPersonalAddress(person);
        break;
      case !!this.companyDetails:
        this.patchCompanyAddress(company);
        break;
      case !!this.companyAddress:
        this.companyAddress = companyAddress;
        if (companyAddress) {
          if (companyAddress.postCode) {
            companyAddress.postCode = companyAddress.postCode.trim();
          }
          this.addressForm.patchValue({
            addressLines: companyAddress.addressLines,
            postCode: companyAddress.postCode,
            countryId: companyAddress.countryId,
            country: companyAddress.country,
          });
        }
        break;
      case !!this.propertyDetails:
        this.patchPropertyAddress(property);
        break;
    }
  }

  private patchCompanyAddress(company: Company) {
    this.companyDetails = company;
    if (company.companyAddress) {
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
  }

  private patchPropertyAddress(property: Property) {
    this.propertyDetails = property;
    this.addressForm.patchValue({
      addressLine2: property.address?.addressLine2,
      flatNumber: property.address?.flatNumber,
      houseNumber: property.address?.houseNumber,
      houseBuildingName: property.address?.houseBuildingName,
      streetName: property.address?.streetName,
      town: property.address?.town,
      postCode: property.address?.postCode?.trim(),
      countryId: this.defaultCountryCode
    });
  }

  private patchPersonalAddress(person: Person) {
    this.personDetails = person;
    if (person.address) {
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
}
