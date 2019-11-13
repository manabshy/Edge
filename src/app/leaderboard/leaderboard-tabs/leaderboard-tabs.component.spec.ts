import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderboardTabsComponent } from './leaderboard-tabs.component';

describe('LeaderboardTabsComponent', () => {
  let component: LeaderboardTabsComponent;
  let fixture: ComponentFixture<LeaderboardTabsComponent>;

  beforeEach(async(() => {
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
