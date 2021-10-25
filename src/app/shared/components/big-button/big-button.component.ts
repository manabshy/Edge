import { Component, Input, Output, EventEmitter } from '@angular/core'

@Component({
  selector: 'app-big-button',
  template: `
    <div
      class="w-64 lg:w-96 mt-4 md:mt-0 h-32 bg-gray-100 rounded-md p-10 flex flex-col items-center justify-center"
      [ngClass]="disabled ? 'hover:shadow-none cursor-not-allowed' : 'hover:shadow-md cursor-pointer'"
      (click)="btnClicked()"
    >
      <div class="w-full md:w-1/2 flex flex-col text-center">
        <div>
          <svg aria-hidden="true" width="64" height="64" viewBox="0 0 64 64" class="icon icon--l">
            <path
              d="M60 35.9H4c-2.2 0-4-1.8-4-4v0c0-2.2 1.8-4 4-4h56c2.2 0 4 1.8 4 4v0C64 34.1 62.2 35.9 60 35.9z"
            ></path>
            <path
              d="M28 59.9v-56c0-2.2 1.8-4 4-4h0c2.2 0 4 1.8 4 4v56c0 2.2-1.8 4-4 4h0C29.8 63.9 28 62.2 28 59.9z"
            ></path>
          </svg>
        </div>
        <span class="mt-4" *ngIf="!disabled" >
          {{ label }}
        </span>
        <span class="mt-4 text-gray-400" *ngIf="disabled" [pTooltip]="'Button disabled'">{{ label }}</span>
      </div>
    </div>
  `
})
export class BigButtonComponent {
  @Input() label: string
  @Input() disabled: boolean
  @Output() onClick: EventEmitter<any> = new EventEmitter()

  btnClicked() {
    if (this.disabled) return
    this.onClick.emit()
  }
}
