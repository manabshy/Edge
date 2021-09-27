import { Injectable } from '@angular/core';
import { Company } from 'src/app/contact-groups/shared/contact-group';
import { Observable, Subject } from 'rxjs';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { map, tap, catchError } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {
  private companyPageChangeSubject = new Subject<number | null>();
  private newCompanySubject = new Subject<Company | null>();
  companyPageChanges$ = this.companyPageChangeSubject.asObservable();
  newCompanyChanges$ = this.newCompanySubject.asObservable();

  constructor(private http: HttpClient) { }

  companyPageChanged(newPage: number) {
    this.companyPageChangeSubject.next(newPage);
  }

  companyChanged(company: Company) {
    this.newCompanySubject.next(company);
  }

  addCompany(company: Company): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}`;
    return this.http.post(url, company).pipe(
      map(response => response),
      tap(data => console.log('added company details here...', JSON.stringify(data)))
    );
  }

  updateCompany(company: Company): Observable<any> {
    const url = `${AppConstants.baseCompanyUrl}/${company.companyId}`;
    return this.http.put(url, company).pipe(
      map(response => response),
      tap(data => console.log('updated company details here...', JSON.stringify(data)))
    );
  }
}
