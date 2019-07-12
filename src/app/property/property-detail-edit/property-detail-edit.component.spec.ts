import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailEditComponent } from './property-detail-edit.component';

describe('PropertyDetailEditComponent', () => {
  let component: PropertyDetailEditComponent;
  let fixture: ComponentFixture<PropertyDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
