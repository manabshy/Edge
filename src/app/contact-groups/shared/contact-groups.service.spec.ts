import { TestBed, fakeAsync, flushMicrotasks, tick, flush } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';

import { ContactGroupsService } from './contact-groups.service';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupsAutocompleteMock } from '../../../testing/fixture-data/contact-groups-autocomplete.json';
import { PersonNote } from './contact-group';
import { NewPersonNoteMock, AddedPersonNoteMock, PersonNotesMock } from 'src/testing/fixture-data/person-note.json';

describe('ContactGroupsService should', () => {
  let httpTestingController: HttpTestingController;
  let service: ContactGroupsService;
  const baseContactGroupUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/contactGroups`;
  const basePersonUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/people`;

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

  it('add a person note', fakeAsync( () => {
    const personNote = (<PersonNote>NewPersonNoteMock);
    const addedPersonNote = <any>AddedPersonNoteMock;
    const url = `${basePersonUrl}/${personNote.personId}/personNotes`;
    console.log('mock person note', personNote);

    service.addPersonNote(personNote).subscribe()

    const req: TestRequest = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');
    req.flush(addedPersonNote);
  }));

  it('return person notes', fakeAsync(() => {
    const url = `${basePersonUrl}/297426/personNotes?pageSize=10&page=1`;
    const notes = PersonNotesMock as any[];
    let response: any[];
    service.getPersonNotes(297426).subscribe(res => response = res);

    const req: TestRequest = httpTestingController.expectOne(url);
    req.flush(notes);
    tick();
    // expect(response.length).toEqual(2);
  }));

  // it('return contact groups autocomplete for a person', ()=>{
  //   const searchTerm = 'wendy younges';
  //   const url = `${baseContactGroupUrl}/search?searchTerm=${searchTerm}`;
  //   service.getAutocompleteContactGroups(searchTerm).subscribe();

  //   const req = httpTestingController.match((request)=> {
  //     return request.urlWithParams == `${baseContactGroupUrl}/search?searchTerm=${searchTerm}`
  //   });
  //   console.log('requst....', req[0])
  //   expect(req[0].request.params);

  //   // const req = httpTestingController.expectOne(url);
  //   // req.flush({searchTerm:searchTerm});
  // });
});
