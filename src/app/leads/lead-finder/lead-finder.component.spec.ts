import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeadFinderComponent } from './lead-finder.component';

describe('LeadFinderComponent', () => {
  let component: LeadFinderComponent;
  let fixture: ComponentFixture<LeadFinderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
