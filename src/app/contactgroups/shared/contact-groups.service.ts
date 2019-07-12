import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { ContactGroupAutoCompleteResult, ContactGroupAutoCompleteData,
         PersonContactData, ContactGroupData, ContactGroup, BasicContactGroup,
         BasicContactGroupData, PeopleAutoCompleteResult, PeopleAutoCompleteData,
         CompanyAutoCompleteResult, CompanyContactGroupAutoCompleteData as CompanyAutoCompleteData,
         Company, CompanyData, SignerAutoCompleteData, Signer, PersonSummaryFiguresData,
         PersonSummaryFigures, SignerData } from './contact-group';
import { map, tap } from 'rxjs/operators';
import { Person, BasicPerson } from 'src/app/core/models/person';

@Injectable({
  providedIn: 'root'
})
export class ContactGroupsService {

  constructor(private http: HttpClient) { }

  // get all the people that belong to a contact group
  getAutocompleteContactGroups(searchTerm: any): Observable<ContactGroupAutoCompleteResult[] > {
    const options = new HttpParams().set('searchTerm', searchTerm);
    const url = `${AppConstants.baseContactGroupUrl}/search`;
    //const url = `${AppConstants.baseContactGroupUrl}/search?SearchTerm=${searchTerm}`;
    return this.http.get<ContactGroupAutoCompleteData>(url, {params: options})
    .pipe(
         map(response => response.result),
         tap(data => console.log(JSON.stringify(data)))
      );
  }
  getAutocompleteSigners(searchTerm: string): Observable<Signer[]> {
    const url = `${AppConstants.baseContactGroupUrl}/autocomplete?SearchTerm=${searchTerm}`;
    return this.http.get<SignerAutoCompleteData>(url)
    .pipe(
         map(response => response.result),
         tap(data => console.log(JSON.stringify(data)))
      );
  }

  getSignerbyId(contactGroupId: number): Observable<Signer> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/contactNames`;
    return this.http.get<SignerData>(url).pipe(map(response => response.result));
  }

  getContactGroupbyId(contactGroupId: number): Observable<ContactGroup> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}`;
    return this.http.get<ContactGroupData>(url).pipe(map(response => response.result));
  }
  getContactPerson(contactGroupId: number, personId: number): Observable<Person> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroupId}/person/${personId}`;
    return this.http.get<PersonContactData>(url).pipe(map(response => response.result));
  }
  getPerson( personId: number): Observable<Person> {
    const url = `${AppConstants.basePersonUrl}/${personId}`;
    return this.http.get<PersonContactData>(url).pipe(map(response => response.result));
  }
  getPersonContactGroups( personId: number): Observable<BasicContactGroup[]> {
    const url = `${AppConstants.basePersonUrl}/${personId}/contactGroups`;
    return this.http.get<BasicContactGroupData>(url).pipe(map(response => response.result));
  }
  getPersonInfo( personId: number): Observable<PersonSummaryFigures> {
    const url = `${AppConstants.basePersonUrl}/${personId}/info`;
    return this.http.get<PersonSummaryFiguresData>(url).pipe(map(response => response.result));
  }
  getAutocompletePeople(person: BasicPerson): Observable<PeopleAutoCompleteResult[]> {
    const options = new HttpParams()
                    .set('firstName', person.firstName  || '')
                    .set('lastName', person.lastName  || '')
                    .set('phoneNumber', person.phoneNumber  || '')
                    .set('emailAddress', person.emailAddress  || '') ;
    const url = `${AppConstants.basePersonUrl}/search`;
    return this.http.get<PeopleAutoCompleteData>(url, {params: options}).pipe(
      map(response => response.result)
      // catchError(this.handleError)
      );
  }
  addPerson(person: Person): Observable<Person | any> {
    const url = `${AppConstants.basePersonUrl}`;
    return this.http.post<PersonContactData>(url, person).pipe(
      map(response => response.result),
      tap(data => console.log('updated person details here...', JSON.stringify(data))));
  }
  updatePerson(person: Person): Observable<any> {
    const url = `${AppConstants.basePersonUrl}/${person.personId}`;
    return this.http.put(url, person).pipe(
      map(response => response),
      tap(data => console.log('updated person details here...', JSON.stringify(data))));
  }
  addContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}`;
    return this.http.post(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated contact details here...', JSON.stringify(data))));
  }
  updateContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseContactGroupUrl}/${contactGroup.contactGroupId}`;
    return this.http.put(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated contact details here...', JSON.stringify(data))));
  }

  getAutocompleteCompany(company: any): Observable<CompanyAutoCompleteResult[]> {
   let options;
  //   if (company && company.companyName.length >= 3) {
  //      options = new HttpParams()
  //                     .set('searchTerm', company.companyName  || '') ;
  //  }
   options = new HttpParams()
                      .set('searchTerm', company.companyName  || '') ;
    const url = `${AppConstants.baseCompanyUrl}/search`;
    return this.http.get<CompanyAutoCompleteData>(url, {params: options}).pipe(
      map(response => response.result),
      tap(data => console.log('company list here here...', JSON.stringify(data)))
      );
  }
  getCompany( companyId: number): Observable<Company | any> {
    const url = `${AppConstants.baseCompanyUrl}/${companyId}`;
    return this.http.get<CompanyData>(url).pipe(
      map(response => response.result),
      tap(data => console.log('company details here...', JSON.stringify(data))));
  }
  addCompanyContactGroup(contactGroup: ContactGroup): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}`;
    return this.http.post(url, contactGroup).pipe(
      map(response => response),
      tap(data => console.log('updated company contact details here...', JSON.stringify(data))));
  }
}

