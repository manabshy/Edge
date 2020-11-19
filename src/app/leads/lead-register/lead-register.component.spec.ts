import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LeadRegisterComponent } from './lead-register.component';

describe('LeadRegisterComponent', () => {
  let component: LeadRegisterComponent;
  let fixture: ComponentFixture<LeadRegisterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
