import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadRegisterComponent } from './lead-register.component';

describe('LeadRegisterComponent', () => {
  let component: LeadRegisterComponent;
  let fixture: ComponentFixture<LeadRegisterComponent>;

  beforeEach(async(() => {
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
