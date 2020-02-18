import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CacheService } from './services/cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {

  constructor(private cacheService: CacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any> | any> {

    // Invalidate cache here if cache status changes
    return next.handle(req).pipe(
      tap((data) => {
        // console.log('all response body', data.body);
        this.cacheService.invalidateCache(data.body);
      })
    );
  }
}

export interface HttpEventResponseBody {
  body: any;
}
