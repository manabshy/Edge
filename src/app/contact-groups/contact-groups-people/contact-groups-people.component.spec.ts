import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';

import { ContactGroupsPeopleComponent } from './contact-groups-people.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { of } from 'rxjs';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockPerson } from 'src/testing/fixture-data/person-data.json';
import { Person } from 'src/app/shared/models/person';
import { ContactGroup } from '../shared/contact-group.interfaces';
import { contactGroupDetailsMock } from 'src/testing/fixture-data/contactgroups-details';
import { DialogService } from 'primeng/dynamicdialog';
import { SharedService } from 'src/app/core/services/shared.service';
import { CurrencyPipe } from '@angular/common';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { PositioningService } from 'ngx-bootstrap/positioning';
import { MessageService } from 'primeng/api';

describe('ContactGroupsPeopleComponent', () => {
  let component: ContactGroupsPeopleComponent;
  let fixture: ComponentFixture<ContactGroupsPeopleComponent>;
  let contactGroupsService: ContactGroupsService;
  let sharedService;
  const contactPerson = contactGroupDetailsMock;

  beforeEach(waitForAsync(() => {
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
        { provide: ToastrService, useValue: {} },
        { provide: Renderer2, useValue: {} },
        { provide: DialogService },
        { provide: SharedService, usevalue: sharedService },
        { provide: BsModalService },
        { provide: MessageService},
        ComponentLoaderFactory,
        PositioningService,
        CurrencyPipe
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
