import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';

import { PersonDuplicateCheckerComponent } from './person-duplicate-checker.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactGroupsService } from '../contact-groups.service';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockBasicPerson, PotentialDuplicatePersonMock } from 'src/testing/fixture-data/person-data.json';
import { of } from 'rxjs';
import { PeopleAutoCompleteResult, PotentialDuplicateResult } from '../contact-group';
import { HighlightPipe } from 'src/app/shared/highlight.pipe';

fdescribe('PersonDuplicateCheckerComponent', () => {
  let component: PersonDuplicateCheckerComponent;
  let fixture: ComponentFixture<PersonDuplicateCheckerComponent>;
  let person;
  let contactGroupsService: ContactGroupsService;
  // let contactGroupsService = jasmine.createSpyObj<ContactGroupsService>(['getPerson', 'getContactGroupNotes']);
  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [PersonDuplicateCheckerComponent, HighlightPipe],
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
        // { provide: ContactGroupsService, useValue: contactGroupsService },
        { provide: ToastrService, useValue: {} },
        { provide: Renderer2, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDuplicateCheckerComponent);
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
    console.log({ res: matchStatus });
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
    console.log({ res: matchStatus });
    expect(matchStatus).toEqual('Part Match');

  }));

  it('should set the match score of no duplicates to 0', fakeAsync(() => {
    person = PotentialDuplicatePersonMock;
    let basicPerson = MockBasicPerson;
    basicPerson = { ...basicPerson, emailAddress: 'test@test.com', phoneNumber: '07676543236' };
    console.log({ basicPerson });
    spyOn(contactGroupsService, 'getPotentialDuplicatePeople').and.returnValue(of(person));

    component.findPotentialDuplicatePerson(basicPerson);
    tick();

    const matchStatus = getMatchingDuplicateStatus(component.potentialDuplicatePeople.matches);
    console.log({ res: matchStatus });
    expect(matchStatus).toEqual('No Match');

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
