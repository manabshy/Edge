import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffmemberFinderComponent } from './staffmember-finder.component';

describe('StaffmemberFinderComponent', () => {
  let component: StaffmemberFinderComponent;
  let fixture: ComponentFixture<StaffmemberFinderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffmemberFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffmemberFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
