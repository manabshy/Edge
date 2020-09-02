import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit.component';
import { Person } from 'src/app/shared/models/person';
import { NO_ERRORS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { ToastrService } from 'ngx-toastr';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { MockPerson } from 'src/testing/fixture-data/person-data.json';
import { MockDropdownListInfo } from 'src/testing/fixture-data/dropdown-list-data.json';

describe('ContactgroupsDetailEditComponent', () => {
  let component: ContactgroupsDetailEditComponent;
  let fixture: ComponentFixture<ContactgroupsDetailEditComponent>;
  let debugEl: DebugElement;
  let element: HTMLElement;
  let personForm: FormGroup,
      firstNameControl: AbstractControl;

  let personSpy: any;
  const person = <Person> <unknown>MockPerson;
  let contactGroupService: ContactGroupsService,
    mockSharedService = {
      getDropdownListInfo: () => of(MockDropdownListInfo),
      scrollToFirstInvalidField: () => null,
      ISOToDate: () => Date(),
      isUKMobile: () => false,
      formatPostCode: () => ''
    },
    mockToastrService = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailEditComponent ],
      imports: [
        HttpClientTestingModule,
        // BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        // {provide: ContactGroupsService, useValue: mockContactGroupService},
        ContactGroupsService,
        {provide: SharedService, useValue: mockSharedService},
        {provide: ToastrService, useValue: mockToastrService}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    contactGroupService = TestBed.get(ContactGroupsService);
    fixture = TestBed.createComponent(ContactgroupsDetailEditComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    debugEl = fixture.debugElement;
    // personForm = component.personForm;
    // firstName = fixture.debugElement.query(By.css('#name')).nativeElement;
    fixture.detectChanges();
    personSpy = spyOn(contactGroupService, 'getPerson').and.returnValue(of(MockPerson));
    personForm = component.personForm;
    firstNameControl = personForm.get('firstName');
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get person details on initialisation', async(() => {
    component.ngOnInit();
    const response = component.personDetails;

    expect(response).toEqual(person);
  }));

  it('form should display the correct firstName', async( () => {
    component.ngOnInit();
    const response = component.personDetails;
    personForm.patchValue(MockPerson);

    fixture.whenStable().then(() => {
      expect(firstNameControl.value).toContain(response.firstName);
    });
  }));

  // it('form should display the correct firstName', async( () => {
  //   component.getPersonDetails(MockPerson.personId);

  //   const emailAddressFormArray = personForm.get('emailAddresses');
  //   console.log('email group 1..',emailAddressFormArray);
  //   fixture.detectChanges();
  //   personForm.patchValue(MockPerson);
  //   console.log('email group',personForm.value);

  //   fixture.whenStable().then(() => {
  //     expect(firstNameControl.value).toContain(component.personDetails.firstName);
  //   });
  // }));

});
