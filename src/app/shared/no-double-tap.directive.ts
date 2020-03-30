import { Directive, HostListener, Input, ViewChild } from '@angular/core';
import { BsDatepickerInlineDirective, BsDatepickerDirective } from 'ngx-bootstrap/datepicker';

@Directive({
  selector: '[appNoDoubleTap]'
})
export class NoDoubleTapDirective {
  @Input() appNoDoubleTap: BsDatepickerDirective
  @HostListener('onShown',  ['$event']) onShown($event) {
    this.onShowPicker($event)
  }
  onShowPicker(event) {
    const dayHoverHandler = event.dayHoverHandler;
    const hoverWrapper = (hoverEvent) => {
        const { cell, isHovered } = hoverEvent;

        if ((isHovered && cell.isHovered &&
          !!navigator.platform &&
          /iPad|iPhone|iPod/.test(navigator.platform)) &&
          'ontouchstart' in window
        ) {
            (this.appNoDoubleTap as any)._datepickerRef.instance.daySelectHandler(cell);
        }

        return dayHoverHandler(hoverEvent);
    };
    event.dayHoverHandler = hoverWrapper;
}
}
