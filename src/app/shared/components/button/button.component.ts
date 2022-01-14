import { Component, EventEmitter, Input, Output } from '@angular/core'
import { Observable } from 'rxjs'

@Component({
  selector: `app-button`,
  template: `
    <button
      class="px-3 py-1.5 rounded-sm mx-auto cursor-pointer hover:bg-ocean-green-600 bg-{{
        backgroundColorClass
      }}-500 duration-75"
      [ngClass]="disabled ? 'disabled' : ''"
      (click)="onClick.emit()"
      [disabled]="disabled"
    >
      <svg aria-hidden="true" viewBox="0 0 64 64" class="h-3 w-3 animate-spin" *ngIf="isSubmitting">
        <path
          fill="#fff"
          d="M11.9 48.4c-4.1-5-6.3-11.5-5.8-18.6C7.1 17.6 16.8 7.5 29 6.2 44.7 4.4 58 16.7 58 32c0 6.2-2.2 11.8-5.8 16.3 -1 1.2-0.8 2.9 0.3 4l0 0c1.3 1.3 3.4 1.1 4.5-0.3 4.8-6 7.5-13.8 7-22.2C62.9 14 50.1 1.2 34.3 0.1 15.6-1.2 0 13.6 0 32c0 7.7 2.7 14.8 7.3 20.3 1.1 1.3 3 1.4 4.2 0.2l0.2-0.2C12.8 51.2 12.8 49.6 11.9 48.4z"
        ></path>
      </svg>
      <span class="text-white text-12 text-center font-sans">
        {{ label }}
      </span>
    </button>
  `
})
export class ButtonComponent {
  @Input() backgroundColorClass: string
  @Input() label: string
  @Input() disabled?: boolean = false
  @Input() isSubmitting?: boolean = false

  @Output() onClick: EventEmitter<any> = new EventEmitter()
}
