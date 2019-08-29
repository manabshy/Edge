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
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AppRoutingModule } from 'src/app/app-routing.module';
import { CoreModule } from 'src/app/core/core.module';
import { ContactgroupsRoutingModule } from '../contactgroups-routing.module';
import { ContactGroupsComponent } from '../contactgroups.component';
import { timer, of, EMPTY } from 'rxjs';
import { mapTo } from 'rxjs/operators';
import { MockCountries, mockDropdownListInfo } from '../shared/test-helper/dropdown-list-data.json';

fdescribe('ContactgroupsDetailEditComponent', () => {
  let component: ContactgroupsDetailEditComponent;
  let fixture: ComponentFixture<ContactgroupsDetailEditComponent>;
  let debugEl: DebugElement;
  let element: HTMLElement;
  let contactGroupService: ContactGroupsService,
    mockSharedService = {
      getDropdownListInfo: () => of(mockDropdownListInfo),
      scrollToFirstInvalidField: () => null,
      ISOToDate: () => Date(),
      isUKMobile: () => false,
      formatPostCode: ()=> ''
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
        RouterModule.forRoot([])
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // it('should have person details', (done) => {
  //   component.countries = MockCountries;
  //   const spy = spyOn(contactGroupService, 'getPerson').and
  //   .returnValue(timer(1000).pipe(mapTo(MockPerson)));
  //  component.ngOnInit();


  // });
  // it('should have the correct name person', () => {
  //   component.countries = MockCountries;
  //  component.personDetails = MockPerson as any;
  //  component.ngOnInit();
  //  fixture.detectChanges();

  //  expect(element.querySelector('[name]').textContent).toContain(MockBasicPerson.firstName);

  // });
});
