import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyMarketingComponent } from './property-marketing.component';

describe('PropertyMarketingComponent', () => {
  let component: PropertyMarketingComponent;
  let fixture: ComponentFixture<PropertyMarketingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyMarketingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyMarketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
