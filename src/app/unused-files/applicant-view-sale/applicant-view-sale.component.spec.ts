import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ApplicantViewSaleComponent } from './applicant-view-sale.component';

describe('ApplicantViewSaleComponent', () => {
  let component: ApplicantViewSaleComponent;
  let fixture: ComponentFixture<ApplicantViewSaleComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicantViewSaleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicantViewSaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
