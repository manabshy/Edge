import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, Validators, FormBuilder } from '@angular/forms';
import { DiaryEvent, newEventForm, DiaryEventTypesEnum, newPropertyForm } from './shared/diary';
import { AppUtils } from '../core/shared/utils';
import { addHours } from 'date-fns';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss']
})
export class DiaryComponent implements OnInit {
  isDropup = false;
  diaryEventForm: FormGroup;
  diaryEvent: DiaryEvent;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.setDropup();
    this.diaryEventForm = newEventForm();
    this.patchDateTime();
  }

  setDropup() {
    if (window.innerWidth < 576) {
      this.isDropup = true;
    } else {
      this.isDropup = false;
    }
  }

  get contactGroups(): FormArray {
    return this.diaryEventForm.get('contactGroups') as FormArray;
  }

  get eventType(): string {
    return this.diaryEventForm.get('eventType').value as string;
  }

  get staffMembers(): FormArray {
    return this.diaryEventForm.get('staffMembers') as FormArray;
  }

  get properties(): FormArray {
    return this.diaryEventForm.get('properties') as FormArray;
  }
  // Patch the date/time to the next available hour
  protected patchDateTime() {

    this.diaryEventForm.patchValue({
      startDateTime: AppUtils.getMomentDate(addHours(new Date(), 1)),
      endDateTime: AppUtils.getMomentDate(addHours(new Date(), 2))
    });
  }
  get canSeeProperty(): boolean {
    const allowed = [
      DiaryEventTypesEnum.ViewingSales,
      DiaryEventTypesEnum.ViewingLettings,
      DiaryEventTypesEnum.ValuationSales,
      DiaryEventTypesEnum.ValuationLettings,
      DiaryEventTypesEnum.PropertyManagement,
    ];
    return (allowed as any[]).indexOf(this.eventType) !== -1;
  }

  /**
   * Set the first control in the array with the supplied value.
   * @param data The contact group Id to set.
   */
  set propertyCtrl(data: any) {
    this.properties.setControl(data.index, this.fb.group({
      propertyId: data.propertyId,
      propertySaleId: data.propertySaleId,
      propertyLettingId: data.propertyLettingId,
      address: data.address
    }));

  }
  // Add a new, empty property
  public addProperty(): void {
    this.properties.push(newPropertyForm());
  }

  /**
   * Delete a property at a given index
   * @param {number} index The index to delete at.
   */
  public deleteProperty(index: number): void {
    this.properties.removeAt(index);
  }

   // Delete all empty properties
  deleteEmptyProperties() {

    for (let i = this.properties.length; i--;) {
      const ctrl = this.properties.at(i);
      const id = ctrl && ctrl.get('propertyId').value;
      if (id === 0) {
        this.properties.removeAt(i);
      }
    }
  }
  public setValidatorByEventType(): void {
    switch (this.diaryEvent.eventType) {
      case DiaryEventTypesEnum.ViewingSales:
      case DiaryEventTypesEnum.ViewingLettings:
      case DiaryEventTypesEnum.ValuationSales:
      case DiaryEventTypesEnum.ValuationLettings:
      case DiaryEventTypesEnum.PropertyManagement:

      // A property and contactGroup is required
        this.diaryEventForm.controls['properties'].setValidators([Validators.required]);
        this.diaryEventForm.controls['properties'].updateValueAndValidity();
        this.diaryEventForm.controls['contactGroups'].setValidators([Validators.required]);
        this.diaryEventForm.controls['contactGroups'].updateValueAndValidity();
        break;
      default:
        // -->Set: properties validators
        this.diaryEventForm.controls['properties'].setValidators([]);
        this.diaryEventForm.controls['properties'].updateValueAndValidity();
        // -->Set: contact groups validators
        this.diaryEventForm.controls['contactGroups'].setValidators([]);
        this.diaryEventForm.controls['contactGroups'].updateValueAndValidity();
        break;
    }
  }
}
