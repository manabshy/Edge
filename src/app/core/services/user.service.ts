import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { UserResult } from '../models/user';
import { HttpClient } from '@angular/common/http';
import { AppConstants } from '../shared/app-constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getUserByEmail(email: string): Observable<UserResult> {
    return this.http.get<UserResult>(`${AppConstants.baseUrl}/${email}`);
  }
}
