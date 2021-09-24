import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ComplianceService {
  
  private _complianceIsInvalid: BehaviorSubject<boolean> = new BehaviorSubject(true)
  public readonly complianceIsInvalid$: Observable<boolean> = this._complianceIsInvalid.asObservable()
    
  constructor() {}

  public setToInvalid(){
    const currentVal = this._complianceIsInvalid.getValue()
    this._complianceIsInvalid.next(!currentVal)
  }
}
