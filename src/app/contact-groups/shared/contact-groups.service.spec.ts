import { TestBed, fakeAsync, flushMicrotasks, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';

import { ContactGroupsService } from './contact-groups.service';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { PersonNote } from './contact-group.interfaces';
import { NewPersonNoteMock, AddedPersonNoteMock, PersonNotesMock } from 'src/testing/fixture-data/person-note.json';
import { doesNotReject } from 'assert';

describe('ContactGroupsService should', () => {
  let httpTestingController: HttpTestingController;
  let service: ContactGroupsService;
  const baseContactGroupUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/contactGroups`;
  const basePersonUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/people`;
  const addedPersonNote = <any>AddedPersonNoteMock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ContactGroupsService],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ContactGroupsService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('be created', () => {
    expect(service).toBeTruthy();
  });


  // TODO: These tests need to be taken out as the method is no longer in use
  xit('add a person note', () => {
    const personNote = (<PersonNote>NewPersonNoteMock);
    const url = `${basePersonUrl}/${personNote.personId}/personNotes`;
    console.log('mock person note', personNote);

    service.addPersonNote(personNote).subscribe(
      (data => {
        console.log(data);
      })
    );

    const req: TestRequest = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush(addedPersonNote);
  });

  xit('return person notes', fakeAsync(() => {
    const url = `${basePersonUrl}/297426/personNotes?pageSize=10&page=1`;
    const notes = PersonNotesMock as any[];
    let response: any[];
    service.getPersonNotes(297426).subscribe(res => response = res);

    const req: TestRequest = httpTestingController.expectOne(url);
    req.flush(notes);
    tick();
    // expect(response.length).toEqual(2);
  }));
});
