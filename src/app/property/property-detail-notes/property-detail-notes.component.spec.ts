import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailNotesComponent } from './property-detail-notes.component';

describe('PropertyDetailNotesComponent', () => {
  let component: PropertyDetailNotesComponent;
  let fixture: ComponentFixture<PropertyDetailNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyDetailNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
