import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core'
import { InfoDetail } from 'src/app/core/services/info.service'

@Component({
  selector: 'app-property-info',
  templateUrl: './property-info.component.html'
  /**
   *   <app-property-info 
                    [(valuationForm)]="valuationForm" 
                    [formErrors]="formErrors"
                    [tenures]="tenures"
                    [propertyTypes]="propertyTypes"
                    [propertyStyles]="propertyStyles"
                    [propertyFloors]="propertyFloors"
                    [isEditable]="isEditable"
                    [isNewValuation]="isNewValuation"
                    [isCancelled]="isCancelled"
                    [showLeaseExpiryDate]="showLeaseExpiryDate"
                    [showStudioLabel]="showStudioLabel"
                    (controlIsCancelled)="controlIsCancelled($event)"
                    (onPropertyTypeChange)="onPropertyType($event)">
                  </app-property-info>
   */
})
export class PropertyInfoComponent implements OnInit {
  @Input() valuationForm: any
  @Input() formErrors: any

  @Input() tenures: InfoDetail[]
  @Input() propertyTypes: InfoDetail[]
  @Input() propertyStyles: InfoDetail[]
  @Input() propertyFloors: InfoDetail[]
  
  @Input() isNewValuation: boolean
  @Input() isEditable: boolean
  @Input() isCancelled: boolean
  @Input() showLeaseExpiryDate: boolean
  @Input() showStudioLabel: boolean

  @Output() controlIsCancelled: EventEmitter<any> = new EventEmitter()
  @Output() onPropertyTypeChange: EventEmitter<any> = new EventEmitter()

ngOnInit() {
  console.log('greetings from property info card!')
  console.log('this: ', this)
}
}
