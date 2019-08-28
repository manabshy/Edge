import { TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';

import { ContactGroupsService } from './contact-groups.service';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupsAutocompleteMock } from './test-helper/contactgroups-autocomplete.json';
import { NewPersonNoteMock, AddedPersonNoteMock } from './test-helper/person-note.json';
import { PersonNote } from './contact-group';

fdescribe('ContactGroupsService should', () => {
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

  it('add a person note',fakeAsync( () => {
    const personNote = (<PersonNote>NewPersonNoteMock);
    const addedPersonNote = <any>AddedPersonNoteMock;
    const url = `${basePersonUrl}/${personNote.personId}/personNotes`;
    console.log('mock person note', personNote);

    service.addPersonNote(personNote).subscribe()
    // service.addPersonNote(personNote).subscribe(data=>{
    //   expect(data).toEqual(addedPersonNote);

    // });

    flushMicrotasks();
    const req: TestRequest = httpTestingController.expectOne(url);
    expect(req.request.method).toEqual('POST');

    req.flush(addedPersonNote);
  }));

  it('return person notes', () => {
    const url = `${basePersonUrl}/1/personNotes`;

    service.getPersonNotes(1).subscribe();

    const req: TestRequest = httpTestingController.expectOne(url);
    req.flush({personNoteId: 1});
  });

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
