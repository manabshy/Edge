import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyChecklistItemComponent } from './property-checklist-item.component';

describe('PropertyChecklistItemComponent', () => {
  let component: PropertyChecklistItemComponent;
  let fixture: ComponentFixture<PropertyChecklistItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PropertyChecklistItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyChecklistItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
