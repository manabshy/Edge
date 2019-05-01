import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Instruction } from '../../shared/dashboard';

@Component({
  selector: 'app-instructions-and-business-development',
  templateUrl: './instructions-and-business-development.component.html',
  styleUrls: ['./instructions-and-business-development.component.scss']
})
export class InstructionsAndBusinessDevelopmentComponent implements OnInit, OnChanges {
@Input() period: string;
@Input() allInstructions: Instruction[];
filteredInstructions: Instruction[] = [];
private _searchTerm = '';

get searchTerm(): string {
  return this._searchTerm;
}
set searchTerm(val: string) {
  this._searchTerm = val;
  this.filteredInstructions = this.searchTerm ? this.performFilter(this.searchTerm) : this.allInstructions;
}

  constructor() { }

  ngOnInit() {

  }

ngOnChanges() {
  if (this.allInstructions || this.searchTerm) {
    this.filteredInstructions = this.allInstructions;
  }
}

performFilter(filterBy: string): Instruction[] {
 filterBy = filterBy.toLocaleLowerCase();
 return this.allInstructions.filter((instruction: Instruction) =>
 instruction.propertyAddress.toLocaleLowerCase().indexOf(filterBy) !== -1);
}
}
