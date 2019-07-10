import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailSalesLettingsComponent } from './property-detail-sales-lettings.component';

describe('PropertyDetailSalesLettingsComponent', () => {
  let component: PropertyDetailSalesLettingsComponent;
  let fixture: ComponentFixture<PropertyDetailSalesLettingsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailSalesLettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailSalesLettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
