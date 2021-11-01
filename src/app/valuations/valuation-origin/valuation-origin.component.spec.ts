import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationOriginComponent } from './valuation-origin.component';

describe('ValuationOriginComponent', () => {
  let component: ValuationOriginComponent;
  let fixture: ComponentFixture<ValuationOriginComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ValuationOriginComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationOriginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
