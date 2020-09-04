import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsPeopleComponent } from './contactgroups-people.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { of } from 'rxjs';
import { contactPersonMock } from 'src/testing/fixture-data/contact-person-data';
import { Renderer2, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

fdescribe('ContactgroupsPeopleComponent', () => {
  let component: ContactgroupsPeopleComponent;
  let fixture: ComponentFixture<ContactgroupsPeopleComponent>;
  const contactPerson = contactPersonMock;
  beforeEach(async(() => {
    const contactGroupsService = jasmine.createSpyObj<ContactGroupsService>(['getPerson', 'getContactGroupNotes']);
    //  service.addCompanyContactGroup.and.returnValue(of([]));
    contactGroupsService.getPerson.and.returnValue(of(contactPerson));
    contactGroupsService.getContactGroupNotes.and.returnValue(of(contactPerson.personNotes));
    TestBed.configureTestingModule({
      declarations: [ContactgroupsPeopleComponent],
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
        { provide: ContactGroupsService, useValue: contactGroupsService },
        { provide: ToastrService, useValue: {} },
        { provide: Renderer2, useValue: {} },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsPeopleComponent);
    component = fixture.componentInstance;
    // fixture.detectChanges();
    const getNextContactNotesPage = () => { }
  });

  it('should create', () => {
    // component.getNextContactNotesPage(1);
    component.ngOnInit()
    expect(component).toBeTruthy();
  });
});
