import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PropertyNotesComponent } from './property-notes.component';

describe('PropertyNotesComponent', () => {
  let component: PropertyNotesComponent;
  let fixture: ComponentFixture<PropertyNotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
