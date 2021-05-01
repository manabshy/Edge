import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyDetailPhotosComponent } from './property-detail-photos.component';

describe('PropertyDetailPhotosComponent', () => {
  let component: PropertyDetailPhotosComponent;
  let fixture: ComponentFixture<PropertyDetailPhotosComponent>;

  beforeEach(waitForAsync(() => {
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
