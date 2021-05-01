import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ValuationsAndInstructionsComponent } from './valuations-and-instructions.component';

describe('ValuationsAndInstructionsComponent', () => {
  let component: ValuationsAndInstructionsComponent;
  let fixture: ComponentFixture<ValuationsAndInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuationsAndInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationsAndInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
