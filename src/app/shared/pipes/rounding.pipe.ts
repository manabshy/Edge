import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rounding'
})
export class RoundingPipe implements PipeTransform {

  transform(value: any): number {
    const rounded = Math.round(value / 1000) * 1000;
    return rounded;
  }
}
