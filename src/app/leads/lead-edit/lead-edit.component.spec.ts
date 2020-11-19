import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeadEditComponent } from './lead-edit.component';

describe('LeadEditComponent', () => {
  let component: LeadEditComponent;
  let fixture: ComponentFixture<LeadEditComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
