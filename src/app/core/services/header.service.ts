import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeaderService {

  private labelSubject = new Subject<string>();
  label$ = this.labelSubject.asObservable();
  constructor() { }

  setheaderLabel(label: string) {
    this.labelSubject.next(label);
  }
  
}
