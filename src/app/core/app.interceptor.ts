import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { WedgeError, SharedService } from './services/shared.service';
import { catchError } from 'rxjs/operators';
import { AppUtils, ICachedRoute } from './shared/utils';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Impersonation } from '../shared/models/staff-member';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  impersonatedStaffMemberId: number;

  constructor(private storage: StorageMap,
              private sharedService:SharedService) {
  }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.storage.get('impersonatedStaffMember').subscribe((person: Impersonation) => {
      if (person) {
        this.impersonatedStaffMemberId = person.staffMemberId;
        console.log('id  in service here....:', this.impersonatedStaffMemberId);
      }
    });
    const jsonReq: HttpRequest<any> = req.clone({
      setHeaders: {
        'Content-Type': 'application/json',
        'work-as': this.impersonatedStaffMemberId ? this.impersonatedStaffMemberId.toString() : ''
      }
    });
    if (req.method !== 'GET') {
      AppUtils.routeCache = new Map<string, ICachedRoute>();
    }
    return next.handle(jsonReq).pipe(catchError(err => this.handleError(err, req.url)));
  }

  private handleError(err: HttpErrorResponse, url:string): Observable<WedgeError> | Observable<any> {
    const wedgeError = new WedgeError();
    if (err.error instanceof ErrorEvent) {
      wedgeError.displayMessage = `An error occurred: ${err.error.message}`;
    } else {
      wedgeError.errorCode = err.status;
      wedgeError.requestId = err.error.requestId;
      wedgeError.technicalDetails = err.error.technicalDetails;
      wedgeError.message = err.error.message;
      if (wedgeError.technicalDetails) {
        wedgeError.displayMessage = `${wedgeError.message}`;
      } else {
        wedgeError.displayMessage = `${wedgeError.message}`;
      }
    }
    wedgeError.requestUrl=url
    console.error('errors from api', err);
    console.error(wedgeError);
    this.sharedService.showError(wedgeError, 'app.inteceptor');
    return throwError(wedgeError);
  }
}
