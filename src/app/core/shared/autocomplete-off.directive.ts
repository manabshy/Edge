import { Directive, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[autocompleteOff]'
})
export class AutocompleteOffDirective {

  constructor(private renderer: Renderer2, private _el: ElementRef) { }

  ngAfterViewInit () {
    setTimeout(() => {
      const inputs = Array.prototype.slice.call(this._el.nativeElement.querySelectorAll('input'))
      inputs.map((e, i) => {
        this.renderer.setAttribute(e, 'autocomplete', 'off');
        this.renderer.setAttribute(e, 'autocorrect', 'off');
        this.renderer.setAttribute(e, 'autocapitalize', 'none');
        this.renderer.setAttribute(e, 'spellcheck', 'false');
      })
    })
  }

}
