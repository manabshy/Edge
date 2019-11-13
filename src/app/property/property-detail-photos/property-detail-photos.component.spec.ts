import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailPhotosComponent } from './property-detail-photos.component';

describe('PropertyDetailPhotosComponent', () => {
  let component: PropertyDetailPhotosComponent;
  let fixture: ComponentFixture<PropertyDetailPhotosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailPhotosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
