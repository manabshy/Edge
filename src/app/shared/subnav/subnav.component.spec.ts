import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SubnavComponent } from './subnav.component';

describe('SubnavComponent', () => {
  let component: SubnavComponent;
  let fixture: ComponentFixture<SubnavComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SubnavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SubnavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
