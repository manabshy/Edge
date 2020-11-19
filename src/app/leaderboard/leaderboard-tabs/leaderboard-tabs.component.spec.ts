import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeaderboardTabsComponent } from './leaderboard-tabs.component';

describe('LeaderboardTabsComponent', () => {
  let component: LeaderboardTabsComponent;
  let fixture: ComponentFixture<LeaderboardTabsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaderboardTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderboardTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
