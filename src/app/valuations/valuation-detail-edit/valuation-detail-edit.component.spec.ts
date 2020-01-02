import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationDetailEditComponent } from './valuation-detail-edit.component';

describe('ValuationDetailEditComponent', () => {
  let component: ValuationDetailEditComponent;
  let fixture: ComponentFixture<ValuationDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuationDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
