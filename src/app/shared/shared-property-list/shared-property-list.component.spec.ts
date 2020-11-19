import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedPropertyListComponent } from './shared-property-list.component';

describe('SharedPropertyListComponent', () => {
  let component: SharedPropertyListComponent;
  let fixture: ComponentFixture<SharedPropertyListComponent>;

  beforeEach(waitForAsync(() => {
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
