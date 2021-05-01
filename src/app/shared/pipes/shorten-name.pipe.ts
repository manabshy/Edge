import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'shortenName'
})
export class ShortenNamePipe implements PipeTransform {

  transform(fullName: string): string {
    const end = fullName.lastIndexOf(' ');
    const firstName = fullName.substring(0, end);
    const lastName = fullName.substr(end + 1, 1);
    return firstName + ' ' + lastName;
  }

}
