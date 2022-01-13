import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicantViewLettingComponent } from './applicant-view-letting.component';

describe('ApplicantViewLettingComponent', () => {
  let component: ApplicantViewLettingComponent;
  let fixture: ComponentFixture<ApplicantViewLettingComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantViewLettingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantViewLettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
