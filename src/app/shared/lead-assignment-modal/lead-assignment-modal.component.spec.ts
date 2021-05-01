import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeadAssignmentModalComponent } from './lead-assignment-modal.component';

describe('LeadAssignmentModalComponent', () => {
  let component: LeadAssignmentModalComponent;
  let fixture: ComponentFixture<LeadAssignmentModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadAssignmentModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAssignmentModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
