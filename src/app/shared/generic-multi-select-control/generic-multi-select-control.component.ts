import { Component, Input, Output, EventEmitter } from '@angular/core';

/***
 * @description a generic select control that displays a list of options and triggers a callback on change
 * @Input label: label to display in the component
 * @Input placeholder: placeholder text to show the user
 * @Input options: the options for the select control
 * @Input cyProp: data attr to target the component in cypress
 * @Output onSelectionChange: the callback function to be called on selection change
 */
@Component({
  selector: 'app-generic-multi-select-control',
  template: `
  <form [attr.data-cy]="cyProp">
  <fieldset>
    <label>{{label}}</label>
    <ng-container>
      <p-multiSelect 
        #multiSelect
        [options]="options" 
        optionLabel="value" 
        optionValue="id"
        placeholder="{{placeholder}}" 
        (onChange)="selectionHasChanged($event)"
       >
      </p-multiSelect>
    </ng-container>

    <p class="message message--negative">{{label}} is required</p>
  </fieldset>
</form>
 `
})
export class GenericMultiSelectControlComponent {

  @Input() label: string
  @Input() placeholder: string
  @Input() options: any
  @Input() cyProp: string

  @Output() onSelectionChange: EventEmitter<Array<any>> = new EventEmitter()
  
  constructor() { }

  selectionHasChanged(vals){
    this.onSelectionChange.emit(vals.value)
  }

}
