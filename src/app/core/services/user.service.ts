import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private userUrl = 'http://localhost:59143/api/users/';
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${username}`);
  }
}
