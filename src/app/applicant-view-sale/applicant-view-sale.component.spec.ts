import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantViewSaleComponent } from './applicant-view-sale.component';

describe('ApplicantViewSaleComponent', () => {
  let component: ApplicantViewSaleComponent;
  let fixture: ComponentFixture<ApplicantViewSaleComponent>;

  beforeEach(async(() => {
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
