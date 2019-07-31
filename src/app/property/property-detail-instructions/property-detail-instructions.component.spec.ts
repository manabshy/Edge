import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailInstructionsComponent } from './property-detail-instructions.component';

describe('PropertyDetailInstructionsComponent', () => {
  let component: PropertyDetailInstructionsComponent;
  let fixture: ComponentFixture<PropertyDetailInstructionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
