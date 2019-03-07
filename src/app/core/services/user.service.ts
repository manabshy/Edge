import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User, UserResult } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private userUrl = 'http://localhost:57211/v1/staffmembers';
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getUserByEmail(email: string): Observable<UserResult> {
    return this.http.get<UserResult>(`${this.userUrl}/${email}`);
  }
}
