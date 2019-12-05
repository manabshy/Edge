import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedPropertyListComponent } from './shared-property-list.component';

describe('SharedPropertyListComponent', () => {
  let component: SharedPropertyListComponent;
  let fixture: ComponentFixture<SharedPropertyListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedPropertyListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedPropertyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
