import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailDocumentsComponent } from './property-detail-documents.component';

describe('PropertyDetailDocumentsComponent', () => {
  let component: PropertyDetailDocumentsComponent;
  let fixture: ComponentFixture<PropertyDetailDocumentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailDocumentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailDocumentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
