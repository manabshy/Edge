import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SubnavItemComponent } from './subnav-item.component';

describe('SubnavItemComponent', () => {
  let component: SubnavItemComponent;
  let fixture: ComponentFixture<SubnavItemComponent>;

  beforeEach(async(() => {
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
