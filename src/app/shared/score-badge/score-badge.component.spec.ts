import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ScoreBadgeComponent } from './score-badge.component';

describe('ScoreBadgeComponent', () => {
  let component: ScoreBadgeComponent;
  let fixture: ComponentFixture<ScoreBadgeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ScoreBadgeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScoreBadgeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
