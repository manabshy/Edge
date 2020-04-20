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
import { DiaryEventTypesEnum, DiaryEvent } from '../shared/diary';
import { PropertyFinderComponent } from 'src/app/shared/property-finder/property-finder.component';
import { StaffMemberFinderComponent } from 'src/app/shared/staff-member-finder/staff-member-finder.component';
import { MockComponents } from 'ng-mocks';
import { MockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { of } from 'rxjs';
import { createStorageMapSpy } from 'src/testing/test-spies';
import { DiaryEventService } from '../shared/diary-event.service';
import { mockDiaryEvents } from 'src/testing/fixture-data/dairy-event-data';
import { BreadcrumbComponent } from 'src/app/shared/breadcrumb/breadcrumb.component';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { FormatAddressPipe } from 'src/app/shared/format-address.pipe';
import { SignerComponent } from 'src/app/shared/signer/signer.component';
import { Signer, ContactGroup } from 'src/app/contactgroups/shared/contact-group';
import { NoopAnimationsModule, BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { ConfirmModalComponent } from 'src/app/shared/confirm-modal/confirm-modal.component';


fdescribe('AddDiaryEventComponent should', () => {
  let component: AddDiaryEventComponent;
  let fixture: ComponentFixture<AddDiaryEventComponent>;
  let rootElement: DebugElement;
  let diaryEventService: DiaryEventService;
  const storageMapSpy = createStorageMapSpy();
  const diaryEvents = (mockDiaryEvents as unknown as DiaryEvent[]);
  const mockDiaryEventService = jasmine.createSpyObj('DiaryEventService', ['getDiaryEvents', 'getDiaryEventById'])
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddDiaryEventComponent,
        // PropertyFinderComponent,
        MockComponents(BreadcrumbComponent, PropertyFinderComponent,
          SignerComponent, StaffMemberFinderComponent)
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserAnimationsModule,
        NoopAnimationsModule,
        RouterTestingModule.withRoutes([]),
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot()
      ],

      providers: [
        BsModalService,
        BsModalRef,

        ToastrService,
        DiaryEventService,
        // { provide: DiaryEventService, useValue: mockDiaryEventService }
        { provide: ComponentFixtureAutoDetect, useValue: true }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA]
    }).overrideModule(BrowserDynamicTestingModule, {
      set: {
        entryComponents: [ConfirmModalComponent],
      }
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiaryEventComponent);
    component = fixture.componentInstance;
    diaryEventService = TestBed.inject(DiaryEventService);
    rootElement = fixture.debugElement;
    component.eventTypes = MockDropdownListInfo.result.diaryEventTypes;
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo));
    // mockDiaryEventService.getDiaryEvents.and.returnValue(of(mockDiaryEvents));

    fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  it('get diary event from service', fakeAsync(() => {
    spyOn(diaryEventService, 'getDiaryEventById').and.returnValue(of(diaryEvents[0]));
    component.diaryEventId = diaryEvents[0].diaryEventId;
    fixture.detectChanges();

    component.getDiaryEvent();
    fixture.detectChanges();
    tick();

    expect(diaryEventService.getDiaryEventById).toHaveBeenCalledTimes(1);
    expect(component.diaryEvent).toBe(diaryEvents[0]);
  }));

  it('show error when no event is selected', fakeAsync(() => {
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    const eventTypeIdControl = component.diaryEventForm.get('eventTypeId');
    spyOn(component, 'onEventTypeChange');
    eventTypeSelect.value = eventTypeSelect.options[0].value;
    fixture.detectChanges();

    component.saveDiaryEvent();
    tick();

    expect(eventTypeIdControl.valid).toBeFalsy();
  }));

  it('clear validation error message when an event is selected', fakeAsync(() => {
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    const eventTypeIdControl = component.diaryEventForm.get('eventTypeId');
    spyOn(component, 'onEventTypeChange');
    eventTypeSelect.value = eventTypeSelect.options[0].value;
    fixture.detectChanges();

    component.saveDiaryEvent();
    eventTypeSelect.value = eventTypeSelect.options[2].value;
    eventTypeSelect.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    tick();

    expect(eventTypeIdControl.valid).toBeTruthy();
  }));

  xit('save a new lettings viewing', fakeAsync(() => {
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    spyOn(component, 'onEventTypeChange');
    eventTypeSelect.value = eventTypeSelect.options[2].value;
    const staffMemberFinder = rootElement.query(By.directive(StaffMemberFinderComponent));
    // staffMemberFinder.click();
    // component.onEventTypeChange(DiaryEventTypesEnum.ViewingLettings);
    fixture.detectChanges();
    tick();
    // eventTypeSelect.dispatchEvent(new Event('change'));
    // component.onEventTypeChange(DiaryEventTypesEnum.ViewingLettings);
    fixture.detectChanges();
    tick();
    console.log('event type select', eventTypeSelect);
  }));

  xit('show other elements when type is selected', fakeAsync(() => {
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

  it('get selected property from property finder', fakeAsync(() => {
    spyOn(component, 'getSelectedProperties');
    component.showProperties = true;
    fixture.detectChanges();
    const propertyFinderComponent = rootElement.query(By.css('app-property-finder')).componentInstance;
    const propertyFinder = (<PropertyFinderComponent>propertyFinderComponent);
    propertyFinder.isMultiple = true;
    propertyFinder.selectedProperties = diaryEvents[0].properties;

    propertyFinder.selectedPropertyList.emit(diaryEvents[0].properties[0]);
    fixture.detectChanges();
    tick();

    expect(component.getSelectedProperties).toHaveBeenCalledWith(diaryEvents[0].properties[0]);
  }));

  it('get selected contact from signer component', fakeAsync(() => {
    spyOn(component, 'getSelectedContactGroups');
    component.showContacts = true;
    fixture.detectChanges();
    const signerComponent = rootElement.query(By.css('app-signer')).componentInstance;
    const signer = (<SignerComponent>signerComponent);
    signer.isMultiple = true;
    signer.selectedSigners = getSignersList(diaryEvents[0].contacts);

    signer.selectedSignersList.emit(getSignersList(diaryEvents[0].contacts));
    fixture.detectChanges();
    tick();

    expect(component.getSelectedContactGroups).toHaveBeenCalledWith(signer.selectedSigners);
  }));

  it('get selected staff member from staff member finder', fakeAsync(() => {
    spyOn(component, 'getSelectedStaffMembers');
    const staffMemberFinderComponent = rootElement.query(By.directive(StaffMemberFinderComponent)).componentInstance;
    const staffMemberFinder = (<StaffMemberFinderComponent>staffMemberFinderComponent);
    fixture.detectChanges();

    staffMemberFinder.selectedStaffMemberList.emit(diaryEvents[0].staffMembers[0]);
    fixture.detectChanges();
    tick();

    expect(component.getSelectedStaffMembers).toHaveBeenCalledWith(diaryEvents[0].staffMembers[0]);
  }));

  it('update an existing diary event', fakeAsync(() => {
    const updatedDiaryEvent = { ...diaryEvents[0], ...{ notes: 'New note for updated event here' } };
    spyOn(diaryEventService, 'updateDiaryEvent').and.returnValue(of(updatedDiaryEvent));
    spyOn(component, 'onSaveComplete');
    const eventTypeSelect = rootElement.query(By.css('#eventTypeId')).nativeElement;
    eventTypeSelect.value = eventTypeSelect.options[1].value;
    const notesControl = component.diaryEventForm.get('notes');
    clearValidators(component);
    component.showOthers = true;
    component.showProperties = true;
    component.showContacts = true;
    notesControl.setValue(updatedDiaryEvent.notes);
    component.diaryEvent = diaryEvents[0];
    component.diaryEventForm.markAsDirty();
    fixture.detectChanges();

    component.saveDiaryEvent();
    fixture.detectChanges();
    tick();

    expect(component.onSaveComplete).toHaveBeenCalledWith(updatedDiaryEvent);
  }));

  it('show delete button when actions is clicked', fakeAsync(() => {
    component.diaryEvent = diaryEvents[0];
    fixture.detectChanges();

    const dropDownButton = rootElement.query(By.css('.btn-group #actionsToggle'))
    dropDownButton.nativeElement.click();
    fixture.detectChanges();
    tick();

    const deleteButton = rootElement.query(By.css('#delete'));
    fixture.detectChanges();
    tick();

    expect(deleteButton.nativeElement.text.trim()).toBe('Delete');
  }));

  xit('delete an existing diary event', fakeAsync(() => {
    const diaryEventToDelete = { ...diaryEvents[0], ...{ diaryEventId: 12345, notes: 'New note for deleted event' } };
    spyOn(diaryEventService, 'deleteDiaryEvent').and.callThrough();
    spyOn(component, 'deleteEvent');
    const modalSpy = spyOn(component, 'showWarning').and.callThrough();
    // component.diaryEvent = diaryEventToDelete;
    component.diaryEvent = diaryEventToDelete;
    fixture.detectChanges();

    const dropDownButton = rootElement.query(By.css('.btn-group #actionsToggle'))
    dropDownButton.nativeElement.click();
    fixture.detectChanges();
    tick();

    const deleteButton = rootElement.query(By.css('#delete'));
    deleteButton.nativeElement.click();
    fixture.detectChanges();
    tick();

    console.log('deelte', deleteButton);
    // component.deleteEvent(diaryEventToDelete.diaryEventId);
    // fixture.detectChanges();
    // tick();

    // expect(modalSpy).toHaveBeenCalledTimes(1);
    expect(component.deleteEvent).toHaveBeenCalledWith(diaryEventToDelete.diaryEventId);
  }));

  function getSignersList(contactList: ContactGroup[]) {
    if (contactList && contactList.length) {
      const result: Signer[] = [];
      let output;
      contactList.forEach(x => {
        output = {
          contactGroupId: x.contactGroupId,
          contactNames: x.contactPeople.map(p => p.addressee).toString(),
          phoneNumber: x.contactPeople.map(n => n.phoneNumbers).toString(),
          emailAddress: x.contactPeople.map(n => n.emailAddresses).toString()
        };
        result.push(output);
      });
      return result;
    }
  }

});

function clearValidators(component: AddDiaryEventComponent) {
  const eventTypeIdControl = component.diaryEventForm.get('eventTypeId');
  eventTypeIdControl.clearValidators();
  eventTypeIdControl.updateValueAndValidity();
}

