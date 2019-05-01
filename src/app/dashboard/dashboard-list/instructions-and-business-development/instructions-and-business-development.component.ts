import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Instruction } from '../../shared/dashboard';
import { SharedService } from 'src/app/core/services/shared.service';
import { MinBedrooms } from 'src/app/property/shared/property';

@Component({
  selector: 'app-instructions-and-business-development',
  templateUrl: './instructions-and-business-development.component.html',
  styleUrls: ['./instructions-and-business-development.component.scss']
})
export class InstructionsAndBusinessDevelopmentComponent implements OnInit, OnChanges {
private _searchTerm = '';
private _minPrice = 0;
private _maxPrice = 0;
@Input() period: string;
@Input() allInstructions: Instruction[];
priceRangeSale: number[];
priceRangeLet: number[];
filteredInstructions: Instruction[] = [];
keepOriginalOrder = (a, b) => a.key;
get searchTerm(): string {
  return this._searchTerm;
}
set searchTerm(val: string) {
  this._searchTerm = val;
  this.filteredInstructions = this.searchTerm ? this.performFilter(this.searchTerm) : this.allInstructions;
}

get minPrice() {
  return this._minPrice;
}
set minPrice(val: number) {
  this._minPrice = val;
  this.filteredInstructions = this.minPrice != 0 ? this.performMinPriceFilter(this.minPrice) : this.allInstructions;
}

get maxPrice() {
  return this._maxPrice;
}
set maxPrice(val: number) {
  this._maxPrice = val;
  this.filteredInstructions = this.maxPrice!= 0 ? this.performMaxPriceFilter(this.maxPrice) : this.allInstructions;
}

get bedroomValues() {
  return MinBedrooms;
}
  constructor(private sharedService: SharedService) {
    this.priceRangeSale = this.sharedService.priceRangeSale();
    this.priceRangeLet = this.sharedService.priceRangeLet();
  }

  ngOnInit() {

  }

ngOnChanges() {
  if (this.allInstructions) {
    this.filteredInstructions = this.allInstructions;
  }
}

  performFilter(filterBy: string): Instruction[] {
  filterBy = filterBy.toLocaleLowerCase();
  return this.allInstructions.filter((instruction: Instruction) =>
  instruction.propertyAddress.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  performMaxPriceFilter(filterBy: number): Instruction[] {
  return this.allInstructions.filter(instruction =>
    (instruction.salesValue < filterBy || instruction.salesValue == filterBy)
    );
  }
  performMinPriceFilter(filterBy: number): Instruction[] {
  return this.allInstructions.filter(instruction => instruction.salesValue > filterBy || instruction.salesValue == filterBy );
  }

/**
   * Determine if the filter has a value different to "empty" values
   */
  // public static isEmptyOrNull(key, val): boolean {
  //   switch (key) {
  //     case 'minPrice':
  //     case 'maxPrice':
  //     case 'minBedrooms':
  //     case 'maxBedrooms':
  //     case 'page':
  //       return val !== -1;

  //     case 'period':
  //     case 'role':
  //     case 'searchTerm':
  //     case 'statuses':
  //       return !!(typeof val === 'string' && val && val.trim().length);

  //     default:
  //       return false;
  //   }
  // }
  /**
   * Filter the search form parameters
   */
  // private filterParameters(filters) {
  //   return Object.keys(filters)
  //     .filter(k => InstructionsAndBusinessDevelopmentComponent.isEmptyOrNull(k, filters[k]))
  //     .reduce((obj: any, key: string) => {
  //       obj[key] = filters[key];
  //       return obj;
  //     }, {});
  // }
}
