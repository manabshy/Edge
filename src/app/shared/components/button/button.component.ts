import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: `app-button`,
  template: `
    <button
      class=" px-4 py-2 text-white text-center rounded-sm mx-auto"
      (click)="onClick.emit()"
      [ngClass]="backgroundColorClass"
      [disabled]="disabled$ | async"
    >
      {{ label }}
    </button>
  `
})
export class ButtonComponent {
  @Input() backgroundColorClass: string
  @Input() label: string
  @Input() disabled$: Observable<boolean> // TODO make observable that disables button whilst active
  // TODO show loading spinned whilst disabled

  @Output() onClick: EventEmitter<any> = new EventEmitter()
}
