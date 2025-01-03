import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { PotentialDuplicateResult, ContactGroup } from '../contact-group.interfaces'
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
  @Input() isCreateNewPersonVisible = false
  @Input() searchTerm: string

  private _potentialDuplicatePeople: PotentialDuplicateResult
  set potentialDuplicatePeople(value) {
    if (value && value.matches && value.matches.length > 0 && value.matches.some((x) => x.matchType === 'FullMatch')) {
      this.isCreateNewPersonVisible = false
    }
    this._potentialDuplicatePeople = value
  }
  @Input() get potentialDuplicatePeople(): PotentialDuplicateResult {
    return this._potentialDuplicatePeople
  }

  @Input() existingIds: number[]

  @Output() addedPersonDetails = new EventEmitter<Person>()
  @Output() selectedPerson = new EventEmitter<Person>()
  @Output() isCanvasHidden = new EventEmitter<boolean>()
  @Output() creatingNewPerson = new EventEmitter<boolean>()
  @Output() findPotentialDuplicatePerson = new EventEmitter<any>()
  @Output() onCreateNewPerson = new EventEmitter<any>()

  isCompanyContactGroup: boolean = false
  personFinderForm: FormGroup
  selectedPersonId: number
  isPersonCanvasVisible = false
  newPerson: BasicPerson

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.initialiseForm()
  }

  initialiseForm() {
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
        let fullNameArr = data.fullName.split(' ')
        if (fullNameArr.length > 1 && (data.phoneNumber.length > 6 || data.emailAddress.indexOf('@') > -1)) {
          this.isCreateNewPersonVisible = true
        }
      }
      this.findPotentialDuplicatePerson.emit(data)
    })
  }

  selectPerson(person) {
    if (this.isAlreadyInContactgroup(person.personId)) {
      alert('This person is already in the group') // TODO finish
    } else {
      this.selectedPerson.emit(person)
    }
  }

  isAlreadyInContactgroup(id: number) {
    return this.existingIds && this.existingIds.find((existingId) => existingId === id)
  }

  addNewPerson() {
    let newPerson = this.personFinderForm.value
    let newPersonNameArr = newPerson.fullName.trim().split(' ')
    newPerson.firstName = newPersonNameArr.length > 0 ? newPersonNameArr[0] : ''
    newPerson.middleName = newPersonNameArr.length === 3 ? newPersonNameArr[1] : ''
    newPerson.lastName = newPersonNameArr.length === 3 ? newPersonNameArr[2] : newPersonNameArr[1]
    this.onCreateNewPerson.emit(newPerson)
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
