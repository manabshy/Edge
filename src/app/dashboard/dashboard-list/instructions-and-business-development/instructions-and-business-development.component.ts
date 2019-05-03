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
isFakeLoadingVisible = false;

get searchTerm(): string {
  return this._searchTerm;
}
set searchTerm(val: string) {
  this._searchTerm = val;
 // this.filteredInstructions = this.searchTerm ? this.performFilter(this.searchTerm) : this.allInstructions;
}

get minPrice() {
  return this._minPrice;
}
set minPrice(val: number) {
  this._minPrice = val;
 // this.filteredInstructions = this.minPrice > 0 ? this.performMinPriceFilter(this.minPrice) : this.allInstructions;
}

get maxPrice() {
  return this._maxPrice;
}
set maxPrice(val: number) {
  this._maxPrice = val;

 // this.filteredInstructions = this.maxPrice > 0 ? this.performMaxPriceFilter(this.maxPrice) : this.allInstructions;
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
  this.fakeLoading();
  if (this.filteredInstructions.length) {
    return this.filteredInstructions.filter((instruction: Instruction) =>
    instruction.propertyAddress.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }
  return this.allInstructions.filter((instruction: Instruction) =>
  instruction.propertyAddress.toLocaleLowerCase().indexOf(filterBy) !== -1);
  }

  performMaxPriceFilter(filterBy: number): Instruction[] {
    this.fakeLoading();
    if (this.filteredInstructions.length) {
      return this.filteredInstructions.filter(instruction => instruction.salesValue < filterBy || instruction.salesValue == filterBy);
    }
    return this.allInstructions.filter(instruction => instruction.salesValue < filterBy || instruction.salesValue == filterBy);
  }

  performMinPriceFilter(filterBy: number): Instruction[] {
    this.fakeLoading();
    if (this.filteredInstructions) {
      return this.filteredInstructions.filter(instruction => instruction.salesValue > filterBy || instruction.salesValue == filterBy );
     }
   return this.allInstructions.filter(instruction => instruction.salesValue > filterBy || instruction.salesValue == filterBy );
  }

  searchInstructions(maxPriceFilter?: number, minPriceFilter?: number, searchTermFilter?: string): Instruction[] {
    this.fakeLoading();
    if (minPriceFilter == 0 && maxPriceFilter == 0 && !searchTermFilter) {
     return this.allInstructions;
   }
    searchTermFilter = searchTermFilter.toLocaleLowerCase();
    return this.filteredInstructions = this.allInstructions.filter(instruction =>
      (instruction.salesValue >= minPriceFilter || minPriceFilter == 0) &&
      (instruction.salesValue <= maxPriceFilter || maxPriceFilter == 0 ) &&
      (instruction.propertyAddress.toLocaleLowerCase().indexOf(searchTermFilter) !== -1 ||
      !searchTermFilter)
      );
  }

  fakeLoading() {
    this.isFakeLoadingVisible = true;
    setTimeout(() => {
      this.isFakeLoadingVisible = false;
    }, 500);
  }
}
