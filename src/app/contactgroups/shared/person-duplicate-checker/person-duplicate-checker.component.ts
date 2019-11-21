import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PotentialDuplicateResult } from '../contact-group';
import { BasicPerson } from 'src/app/core/models/person';

@Component({
  selector: 'app-person-duplicate-checker',
  templateUrl: './person-duplicate-checker.component.html',
  styleUrls: ['./person-duplicate-checker.component.scss']
})
export class PersonDuplicateCheckerComponent implements OnInit {
  personFinderForm: FormGroup;
  potentialDuplicatePeople: PotentialDuplicateResult;
  isOffCanvasVisible = false;
  isCreateNewPersonVisible = false;
  isCreateNewPerson = false;
  newPerson: BasicPerson;

  constructor(private fb: FormBuilder, private renderer: Renderer2) { }

  ngOnInit() {
    this.personFinderForm = this.fb.group({
      firstName: [''],
      lastName: [''],
      fullName: [''],
      emailAddress: [''],
      phoneNumber: ['']
    });
  }

  selectPerson(id: number) {

  }

  showAddedPersonId() {

  }

  phoneNumberOnly() {

  }

  showHideOffCanvas(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isOffCanvasVisible = !this.isOffCanvasVisible;
    if (this.isOffCanvasVisible) {
      this.renderer.addClass(document.body, 'no-scroll');
    } else {
      this.renderer.removeClass(document.body, 'no-scroll');
    }
  }

  getAddedPersonDetails() {

  }

  checkDuplicateInContactGroup(id) {

  }

  createNewContactGroupPerson(event) {
    event.preventDefault();
    event.stopPropagation();
    this.isCreateNewPerson = true;

    setTimeout(() => {
      // this.offCanvasContent.nativeElement.scrollTo(0, 0);
    });
  }

  backToFinder() {

  }
  hideCanvas() {

  }
}
