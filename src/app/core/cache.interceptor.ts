import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpResponse, HttpEventType } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import {tap} from 'rxjs/operators';
import { HttpCacheService } from './services/http-cache.service';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  maxTime = 3000;
  constructor(private cacheService: HttpCacheService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    // Pass along non-cacheable requests and invalidate cache
    if (req.method !== 'GET') {
      console.log(`Invalidating cache: ${req.method} ${req.url}`);
      this.cacheService.invalidateCache();
      return next.handle(req);
    }

    // get response from cache
    const cachedResponse: HttpResponse<any> = this.cacheService.get(req.url);
    if (cachedResponse) {
      console.log(`Returning from a cached response: ${cachedResponse.url}`);
      return of(cachedResponse);
    }

    // send request to server and add response to cache
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log(`Adding item to cache:  ${req.url}`);
          this.cacheService.put(req.url, event);
        }
      })
    );
  }
}
