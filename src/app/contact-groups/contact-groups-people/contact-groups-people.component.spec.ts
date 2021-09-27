import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ContactGroupsPeopleComponent } from './contact-groups-people.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { of } from 'rxjs';
import { contactPersonMock } from 'src/testing/fixture-data/contact-person-data';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ContactGroupsAutocompleteMock } from 'src/testing/fixture-data/contactgroups-autocomplete.json';
import { MockPerson } from 'src/testing/fixture-data/person-data.json';
import { Person } from 'src/app/shared/models/person';
import { contactGroupDetailsMock } from 'src/testing/fixture-data/contactgroups-details';
import { ContactGroup } from '../shared/contact-group';

describe('ContactGroupsPeopleComponent', () => {
  let component: ContactGroupsPeopleComponent;
  let fixture: ComponentFixture<ContactGroupsPeopleComponent>;
  let contactGroupsService: ContactGroupsService;
  const contactPerson = contactGroupDetailsMock;

  beforeEach(waitForAsync(() => {
    // const contactGroupsService = jasmine.createSpyObj<ContactGroupsService>(['getPerson', 'getContactGroupNotes']);
    //  service.addCompanyContactGroup.and.returnValue(of([]));
    // contactGroupsService.getPerson.and.returnValue(of(contactPerson));
    // contactGroupsService.getContactGroupNotes.and.returnValue(of(contactPerson.personNotes));
    TestBed.configureTestingModule({
      declarations: [ContactGroupsPeopleComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
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
    fixture = TestBed.createComponent(ContactGroupsPeopleComponent);
    component = fixture.componentInstance;
    contactGroupsService = TestBed.inject(ContactGroupsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get main contact person details', fakeAsync(() => {
    const person = MockPerson;
    const contactGroupDetails = contactGroupDetailsMock;
    const spy = spyOn(contactGroupsService, 'getPerson').and.returnValue(of(contactPerson));
    component.selectedPeople = null;
    component.contactGroupDetails = contactGroupDetails as unknown as ContactGroup;

    component.getPersonDetails(person.personId);
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
  }));
});
