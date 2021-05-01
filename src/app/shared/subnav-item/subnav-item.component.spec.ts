import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubnavItemComponent } from './subnav-item.component';

describe('SubnavItemComponent', () => {
  let component: SubnavItemComponent;
  let fixture: ComponentFixture<SubnavItemComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubnavItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnavItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
