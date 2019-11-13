import { TestBed } from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController, TestRequest} from '@angular/common/http/testing';

import { LeaderboardService } from './leaderboard.service';

describe('LeaderboardService', () => {
  let leaderboardService: LeaderboardService;
  let httpTestingController: HttpTestingController;
  beforeEach(() =>
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LeaderboardService]
    })
  );

  it('should be created', () => {
    leaderboardService = TestBed.get(LeaderboardService);
    httpTestingController = TestBed.get(HttpTestingController);
    expect(leaderboardService).toBeTruthy();
  });
});
