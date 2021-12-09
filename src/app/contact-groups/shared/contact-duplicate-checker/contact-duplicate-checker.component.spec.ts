import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ContactDuplicateCheckerComponent } from './contact-duplicate-checker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactGroupsService } from '../contact-groups.service';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockBasicPerson, PotentialDuplicatePersonMock } from 'src/testing/fixture-data/person-data.json';
import { of } from 'rxjs';
import { PeopleAutoCompleteResult, PotentialDuplicateResult } from '../contact-group.interfaces';
import { HighlightPipe } from 'src/app/shared/pipes/highlight.pipe';

describe('ContactDuplicateCheckerComponent', () => {
  let component: ContactDuplicateCheckerComponent;
  let fixture: ComponentFixture<ContactDuplicateCheckerComponent>;
  let person;
  let contactGroupsService: ContactGroupsService;
  beforeEach(waitForAsync(() => {

    TestBed.configureTestingModule({
      declarations: [ContactDuplicateCheckerComponent, HighlightPipe],
      imports: [
        HttpClientTestingModule,
        // FormsModule,
        ReactiveFormsModule,
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        BsModalService,
        { provide: ToastrService, useValue: {} },
        { provide: Renderer2, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactDuplicateCheckerComponent);
    component = fixture.componentInstance;
    contactGroupsService = TestBed.inject(ContactGroupsService);
  });

  afterEach(() => { person = null; });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should check potential duplicate person', fakeAsync(() => {
    person = PotentialDuplicatePersonMock;
    const basicPerson = MockBasicPerson;
    const spy = spyOn(contactGroupsService, 'getPotentialDuplicatePeople').and.returnValue(of(person));

    component.findPotentialDuplicatePerson(basicPerson);
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should set the match score of a duplicate person to 10', fakeAsync(() => {
    person = PotentialDuplicatePersonMock;
    const basicPerson = MockBasicPerson;
    spyOn(contactGroupsService, 'getPotentialDuplicatePeople').and.returnValue(of(person));

    component.findPotentialDuplicatePerson(basicPerson);
    tick();

    component.isPersonCanvasVisible = true;
    console.log('new person', component.potentialDuplicatePeople);
    const matchStatus = getMatchingDuplicateStatus(component.potentialDuplicatePeople.matches);
    expect(matchStatus).toEqual('Good Match');

  }));

  it('should set the match score of a part duplicate match to 7', fakeAsync(() => {
    person = PotentialDuplicatePersonMock;
    let basicPerson = MockBasicPerson;
    basicPerson = { ...basicPerson, emailAddress: 'test@test.com' };
    spyOn(contactGroupsService, 'getPotentialDuplicatePeople').and.returnValue(of(person));

    component.findPotentialDuplicatePerson(basicPerson);
    tick();

    component.isPersonCanvasVisible = true;
    console.log('new person', component.potentialDuplicatePeople);
    const matchStatus = getMatchingDuplicateStatus(component.potentialDuplicatePeople.matches);
    expect(matchStatus).toEqual('Part Match');

  }));

  it('should set the match score of no duplicates to 0', fakeAsync(() => {
    person = PotentialDuplicatePersonMock;
    let basicPerson = MockBasicPerson;
    basicPerson = { ...basicPerson, emailAddress: 'test@test.com', phoneNumber: '07676543236' };
    spyOn(contactGroupsService, 'getPotentialDuplicatePeople').and.returnValue(of(person));

    component.findPotentialDuplicatePerson(basicPerson);
    tick();

    const matchStatus = getMatchingDuplicateStatus(component.potentialDuplicatePeople.matches);
    expect(matchStatus).toEqual('No Match');

  }));

  it(`should set new person's first name and last name to the entered names`, fakeAsync(() => {
    person = PotentialDuplicatePersonMock;
    const basicPerson = MockBasicPerson;
    spyOn(contactGroupsService, 'getPotentialDuplicatePeople').and.returnValue(of(person));

    component.findPotentialDuplicatePerson(basicPerson);
    tick();

    expect(component.newPerson.firstName).toEqual(basicPerson.firstName);
    expect(component.newPerson.lastName).toEqual(basicPerson.lastName);

  }));
});

const getMatchingDuplicateStatus = (matches: PeopleAutoCompleteResult[]) => {
  let result = 'No Match';

  matches.forEach(x => {
    if (x.matchScore === 10) { result = 'Good Match'; }
    if (x.matchScore === 7) { result = 'Part Match'; }
  });

  return result;
};
