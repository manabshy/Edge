import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
private userUrl = 'http://localhost:57211/v1/staffmembers';
  constructor(private http: HttpClient, private authService: AuthService) { }

  public getUserByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${this.userUrl}/${username}`);
  }
}
