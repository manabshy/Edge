import { Component, Input } from '@angular/core'

/***
 * @name MessagesComponent
 * @description Generic message component that displays multi-line messages on coloured backgrounds
 *  as an aside to inform users of useful information.
 * @param {type: 'success|info|warn|error', text:['Line 1 text', 'Line 2 text']} - message
 */
@Component({
  selector: 'app-messages',
  template: `
    <p-messages severity="{{ message.type }}">
      <ng-template pTemplate>
        <div data-cy="availabilityMessage" class="flex flex-row items-center">
          <i
            class="fa text-xl"
            [ngClass]="
              message.type === 'success'
                ? 'fa-check-circle text-green-600'
                : message.type === 'warn'
                ? 'fa-exclamation-triangle text-yellow-600'
                : message.type === 'info'
                ? 'fa-info-circle text-blue-500'
                : message.type === 'error'
                ? 'fa-times-circle text-red-500'
                : ''
            "
          ></i>
          <div class="px-2 tracking-normal">
            <p *ngFor="let message of message.text; let i = index; let even = even" [ngClass]="even ? '-mb-1' : 'mt-2'">
              {{ message }}
            </p>
          </div>
        </div>
      </ng-template>
    </p-messages>
  `
})
export class MessagesComponent {
  @Input() message: any
}
