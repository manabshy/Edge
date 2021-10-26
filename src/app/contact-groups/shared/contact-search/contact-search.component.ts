import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { PotentialDuplicateResult, ContactGroup, ContactType } from '../contact-group'
import { BasicPerson, Person } from 'src/app/shared/models/person'
import { debounceTime } from 'rxjs/operators'

@Component({
  selector: 'app-contact-search',
  templateUrl: './contact-search.component.html'
})
export class ContactSearchComponent implements OnInit {
  @Input() contactGroupDetails: ContactGroup
  @Input() isOffCanvasVisible: boolean
  @Input() isCreateNewPerson = false
  @Input() searchTerm: string
  @Input() potentialDuplicatePeople: PotentialDuplicateResult
  @Output() addedPersonDetails = new EventEmitter<Person>()
  @Output() selectedPerson = new EventEmitter<Person>()
  @Output() isCanvasHidden = new EventEmitter<boolean>()
  @Output() makeButtonVisible = new EventEmitter<boolean>()
  @Output() creatingNewPerson = new EventEmitter<boolean>()
  @Output() findPotentialDuplicatePerson = new EventEmitter<any>()
  @Output() navigate = new EventEmitter<any>()

  isCompanyContactGroup: boolean = false
  personFinderForm: FormGroup
  selectedPersonId: number
  isPersonCanvasVisible = false
  isCreateNewPersonVisible = false
  newPerson: BasicPerson

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.personFinderForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: [this.searchTerm],
      emailAddress: [''],
      phoneNumber: ['']
    })
    if (this.searchTerm) {
      this.findPotentialDuplicatePerson.emit(this.personFinderForm.value)
    }
    this.personFinderForm.valueChanges.pipe(debounceTime(750)).subscribe((data: BasicPerson) => {
      if (data.fullName && (data.phoneNumber || data.emailAddress)) {
        this.isCreateNewPersonVisible = true
        this.makeButtonVisible.emit(true)
      } else {
        this.isCreateNewPersonVisible = false
        this.makeButtonVisible.emit(false)
      }
      this.findPotentialDuplicatePerson.emit(data)
    })
  }

  createNewContactGroupPerson() {
    this.navigate.emit()
  }

  selectPerson(person) {
    console.log('selectPerson: ', person)
    this.selectedPerson.emit(person)
  }

  isAlreadyInContactgroup(id: number) {
    let isDuplicate = false
    if (this.contactGroupDetails && this.contactGroupDetails.contactPeople) {
      this.contactGroupDetails.contactPeople.forEach((x) => {
        if (x && x.personId === id) {
          isDuplicate = true
        }
      })
    }
    return isDuplicate
  }

  /* Only allow spaces, dashes, the plus sign and digits */
  phoneNumberOnly(event): boolean {
    const charCode = event.which ? event.which : event.keyCode
    const isCodeNotAllowed =
      charCode > 31 && charCode !== 45 && charCode !== 43 && charCode !== 32 && (charCode < 48 || charCode > 57)
    if (isCodeNotAllowed) {
      return false
    }
    return true
  }
}
