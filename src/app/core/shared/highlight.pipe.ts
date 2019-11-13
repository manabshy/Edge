import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'highlight'
})
export class HighlightPipe implements PipeTransform {

  transform(value: any, args?: any, trim?: boolean): any {
    if (args && value) {
      args = args.toLowerCase();
      if(trim) {
        args = args.replace(/\s+/g, '');
      }
      let startIndex = value.toLowerCase().indexOf(args);
      if (startIndex != -1) {
        let endLength = args.length;
        let matchingString = value.substr(startIndex, endLength);
        return value.replace(matchingString, "<mark>" + matchingString + "</mark>");
      }

    }
    return value;
  }

}
