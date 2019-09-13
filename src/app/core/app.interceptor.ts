import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { WedgeError } from './services/shared.service';
import { catchError } from 'rxjs/operators';
import { AppUtils } from './shared/utils';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const jsonReq: HttpRequest<any> = req.clone({
      setHeaders : {'Content-Type': 'application/json'}
    });
    if(req.method !== "GET") {
      AppUtils.routeHandlers = {};
    }
    return next.handle(jsonReq).pipe(catchError(err => this.handleError(err)));
  }

  private handleError(err: HttpErrorResponse): Observable<WedgeError> |  Observable<any> {
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
    console.error('errors from api', err);
    console.error(wedgeError);
    return throwError(wedgeError);
  }
}
