import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit.component';
import { BasicPerson, Person } from 'src/app/core/models/person';
import { NO_ERRORS_SCHEMA, DebugElement, Renderer2 } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Location } from '@angular/common';
import { SharedService } from 'src/app/core/services/shared.service';
import { ContactGroupsService } from '../shared/contact-groups.service';
import { MockBasicPerson, MockPerson } from '../shared/test-helper/person-data.json';
import { ToastrService } from 'ngx-toastr';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl, FormArray } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ContactgroupsRoutingModule } from '../contactgroups-routing.module';
import { ContactGroupsComponent } from '../contactgroups.component';
import { timer, of, EMPTY, Observable, from } from 'rxjs';
import { mapTo, first } from 'rxjs/operators';
import { MockCountries, MockDropdownListInfo } from '../shared/test-helper/dropdown-list-data.json';
import { Mock } from 'protractor/built/driverProviders';
import { ValidationMessages } from 'src/app/core/shared/app-constants';
import { RouterTestingModule } from '@angular/router/testing';
import { Property } from 'src/app/property/shared/property';
import { MockProperty } from 'src/app/property/shared/test-helper';

describe('ContactgroupsDetailEditComponent', () => {
  let component: ContactgroupsDetailEditComponent;
  let fixture: ComponentFixture<ContactgroupsDetailEditComponent>;
  let debugEl: DebugElement;
  let element: HTMLElement;
  let personForm: FormGroup,
      firstNameControl: AbstractControl,
      saveButton: DebugElement;

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
        BrowserModule,
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
    const clickButton = () => {
      fixture.debugElement.query(By.css('.btn-secondary')).triggerEventHandler('click', null);
    };
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
