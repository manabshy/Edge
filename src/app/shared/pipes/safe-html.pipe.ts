import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import DOMPurify from 'dompurify';

@Pipe({
  name: 'safeHtml'
})
export class SafeHtmlPipe implements PipeTransform {

  constructor(protected sanitizer: DomSanitizer) { }

  transform(value: any, ...args: unknown[]): unknown {
    const sanitizedContent = DOMPurify.sanitize(value);
    return this.sanitizer.bypassSecurityTrustHtml(sanitizedContent);
  }

}
