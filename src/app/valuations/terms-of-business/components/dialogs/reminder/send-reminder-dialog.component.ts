import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'

@Component({
  selector: 'app-send-reminder-confirmation-dialog',
  template: `
    <p-dialog header="Send Email Reminder?" appendTo="body" [(visible)]="showDialog" [modal]="true" [draggable]="false" (onHide)="close(false)">
      <div class="flex flex-col" style="width: 500px">
        <p>Please confirm you would like to send a reminder email about signing Terms of Business document</p>
        <footer class="mt-10">
          <div class="flex flex-row space-x-4">
            <span class="flex-1"></span>
            <button type="button" class="btn btn--ghost" (click)="close(false)">Cancel</button>
            <button type="button" class="btn btn--positive" (click)="close(true)" data-cy="send">Send It</button>
          </div>
        </footer>
      </div>
    </p-dialog>
  `
})
export class SendReminderConfirmationDialogComponent implements OnInit {
  @Output() onDialogClosed: EventEmitter<any> = new EventEmitter()
  @Input() showDialog: boolean = false

  close(send) {
    this.showDialog = false
    this.onDialogClosed.emit(send)
  }

  ngOnInit(){
    console.log('send reminder dialog initting: ', this.showDialog)
  }

}

