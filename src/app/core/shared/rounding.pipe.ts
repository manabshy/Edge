import { Pipe, PipeTransform } from '@angular/core';
import { CurrencyPipe, formatCurrency } from '@angular/common';

@Pipe({
  name: 'rounding'
})
export class RoundingPipe implements PipeTransform {

  transform(value: any): number {
const rounded = Math.round(value / 1000) * 1000;
console.log('rounding tie up again: ', rounded);  // 90000

    return rounded;
  }

}
