import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyMarketingComponent } from './property-marketing.component';

describe('PropertyMarketingComponent', () => {
  let component: PropertyMarketingComponent;
  let fixture: ComponentFixture<PropertyMarketingComponent>;

  beforeEach(waitForAsync(() => {
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
