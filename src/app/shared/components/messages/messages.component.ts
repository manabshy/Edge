import { Component, Input } from '@angular/core'

/***
 * @name MessagesComponent
 * @description Generic message component that displays multi-line messages on coloured backgrounds
 *  as an aside to inform users of useful information.
 * @param message {type: 'success|info|warn|error', text:['Line 1 text', 'Line 2 text']}
 */
@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html'
})
export class MessagesComponent {

  @Input() message: any

}
