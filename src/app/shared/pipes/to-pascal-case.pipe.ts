import { Pipe, PipeTransform } from '@angular/core';
import * as lodash from 'lodash';

@Pipe({
  name: 'toPascalCase'
})
export class ToPascalCasePipe implements PipeTransform {

  transform(value: string, ...args: unknown[]): unknown {
    return lodash.startCase(value);
  }

}
