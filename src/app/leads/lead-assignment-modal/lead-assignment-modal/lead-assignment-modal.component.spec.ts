import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAssignmentModalComponent } from './lead-assignment-modal.component';

describe('LeadAssignmentModalComponent', () => {
  let component: LeadAssignmentModalComponent;
  let fixture: ComponentFixture<LeadAssignmentModalComponent>;

  beforeEach(async(() => {
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
