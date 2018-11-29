import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantRegisterComponent } from './applicant-register.component';

describe('ApplicantRegisterComponent', () => {
  let component: ApplicantRegisterComponent;
  let fixture: ComponentFixture<ApplicantRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
