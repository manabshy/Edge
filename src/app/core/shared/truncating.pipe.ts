import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncating'
})
export class TruncatingPipe implements PipeTransform {

  transform(value: string): string {
    const end = value.lastIndexOf(',');
    const result = value.substring(0, end);
    console.log(end, value, result);
    return end > 0 ?  result + ' k' : '£0';
  }

}
