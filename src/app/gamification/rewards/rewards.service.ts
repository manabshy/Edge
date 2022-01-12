import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as signalR from "@aspnet/signalr";
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { StaffMember } from 'src/app/shared/models/staff-member';
import { AppConstants } from '../../core/shared/app-constants';
import { StaffMemberService } from '../../core/services/staff-member.service';
 
export interface SwagBag {
  swagBag: number
}

export interface Streak {
  currentStreak: number,
  streakAmount: number
}

export interface Bonus {
  name: string,
  bonusDetailCriteria : BonusDetail[]
}

export interface BonusDetail {
  name: string,
  target: number,
  completed: number,
  iconId: number
}

@Injectable({
  providedIn: 'root'
})
export class RewardsService {
 
  isLoaded = false;
  constructor(private http: HttpClient) {  }
 
  getSwagBag(): Observable<SwagBag | any> {
    const url = `${AppConstants.baseRewardsUrl}/board/swag-bag`
    return this.http.get<any>(url).pipe(
      map((response) => {
        return response.result
      })
    )
  }

  getStreak(): Observable<Streak | any> {
    const url = `${AppConstants.baseRewardsUrl}/board/streak`
    return this.http.get<any>(url).pipe(
      map((response) => {
          return response.result
      })
    )
  }

  getBonuses(): Observable<Bonus[] | any> {
    const url = `${AppConstants.baseRewardsUrl}/board/bonus`
    return this.http.get<any>(url).pipe(
      map((response) => {
        return response.result
      })
    )
  }

}