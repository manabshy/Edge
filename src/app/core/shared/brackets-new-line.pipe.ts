import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'bracketsNewLine'
})
export class BracketsNewLinePipe implements PipeTransform {

  transform(value: any): any {
    if (value) {
      let openBracketsIndex = value.indexOf('(');
      if (openBracketsIndex != -1) {
        let newString = value.substring(0,openBracketsIndex)+"<br/>"+value.substring(openBracketsIndex);
        return newString;
      }

    }
    return value;
  }

}
