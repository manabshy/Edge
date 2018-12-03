import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantMatchingComponent } from './applicant-matching.component';

describe('ApplicantMatchingComponent', () => {
  let component: ApplicantMatchingComponent;
  let fixture: ComponentFixture<ApplicantMatchingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantMatchingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantMatchingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
