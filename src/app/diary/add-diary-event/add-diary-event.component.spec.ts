import { async, ComponentFixture, TestBed, fakeAsync, tick, ComponentFixtureAutoDetect } from '@angular/core/testing';

import { AddDiaryEventComponent } from './add-diary-event.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule, BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { DiaryEventTypesEnum } from '../shared/diary';
import { PropertyFinderComponent } from 'src/app/shared/property-finder/property-finder.component';
import { StaffMemberFinderComponent } from 'src/app/shared/staff-member-finder/staff-member-finder.component';
import { MockComponent } from 'ng-mocks';
import { MockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { of } from 'rxjs';
import { createStorageMapSpy } from 'src/testing/test-spies';


fdescribe('AddDiaryEventComponent', () => {
  let component: AddDiaryEventComponent;
  let fixture: ComponentFixture<AddDiaryEventComponent>;
  let rootElement: DebugElement;
  const storageMapSpy = createStorageMapSpy();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiaryEventComponent, MockComponent(StaffMemberFinderComponent)],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        BsDatepickerModule.forRoot()

      ],
      providers: [
        BsModalService,
        BsModalRef,
        ToastrService
        // { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiaryEventComponent);
    component = fixture.componentInstance;
    rootElement = fixture.debugElement;
    component.eventTypes = MockDropdownListInfo.result.diaryEventTypes;
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show error when no event is selected', fakeAsync(() => {
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    const evenTypeValidationError = rootElement.query(By.css('.invalid-feedback'));

    spyOn(component, 'onEventTypeChange');
    eventTypeSelect.value = eventTypeSelect.options[0].value;
    fixture.detectChanges();
    component.saveDiaryEvent();
    tick();

    expect(evenTypeValidationError).toBeTruthy();
    console.log('error for no type selected', evenTypeValidationError);
    // expect(evenTypeValidationError.nativeElement.textContext).toBe('Event Type is required');
  }));

  xit('should clear validation error message when an event is selected', fakeAsync(() => {
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    const evenTypeValidationError = rootElement.query(By.css('.invalid-feedback'));

    spyOn(component, 'onEventTypeChange');
    eventTypeSelect.value = eventTypeSelect.options[0].value;
    fixture.detectChanges();
    component.saveDiaryEvent();
    eventTypeSelect.value = eventTypeSelect.options[2].value;
    fixture.detectChanges();
    tick();

    expect(evenTypeValidationError).toBeFalsy();
    console.log('no error here', evenTypeValidationError);
    // expect(evenTypeValidationError.nativeElement.textContext).toBe('Event Type is required');
  }));

  xit('should show other elements when type is selected', fakeAsync(() => {
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    spyOn(component, 'onEventTypeChange');
    eventTypeSelect.value = eventTypeSelect.options[2].value;
    component.showOthers = true;
    component.showProperties = true;
    component.showContacts = true;
    // eventTypeSelect.dispatchEvent(new Event('change'));
    // component.onEventTypeChange(DiaryEventTypesEnum.ViewingLettings);
    fixture.detectChanges();
    tick();
    console.log('event type select', eventTypeSelect);
  }));

  xit('should get selected staff member', fakeAsync(() => {
    const staffMemberFinder = rootElement.query(By.directive(StaffMemberFinderComponent));
    // staffMemberFinder.click();
    // component.onEventTypeChange(DiaryEventTypesEnum.ViewingLettings);
    fixture.detectChanges();
    tick();
    console.log('staff member finder', staffMemberFinder);
  }));


});
