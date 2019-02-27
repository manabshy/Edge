import { Injectable } from '@angular/core';
import { Leaderboard } from './leaderboard';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { LeaderboardService } from './leaderboard.service';

@Injectable({
  providedIn: 'root'
})
export class PipelineResolver implements Resolve<Leaderboard[]> {
  constructor(private leaderboardService: LeaderboardService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Leaderboard[] | Observable<Leaderboard[]> {
   const role = 'salesManager';
    return this.leaderboardService.getStaffMemberPipeline(role);
  }

}
