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
isAdvSearchCollapsed = false;
  get searchTerm(): string {
    return this._searchTerm;
  }
  set searchTerm(val: string) {
    this._searchTerm = val;
  }

  get minPrice() {
    return this._minPrice;
  }
  set minPrice(val: number) {
    this._minPrice = val;
  }

  get maxPrice() {
    return this._maxPrice;
  }
  set maxPrice(val: number) {
    this._maxPrice = val;
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
