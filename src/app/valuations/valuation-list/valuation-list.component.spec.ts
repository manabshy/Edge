import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValuationListComponent } from './valuation-list.component';

describe('ValuationListComponent', () => {
  let component: ValuationListComponent;
  let fixture: ComponentFixture<ValuationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
