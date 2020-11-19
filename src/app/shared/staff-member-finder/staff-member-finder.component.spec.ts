import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StaffMemberFinderComponent } from './staff-member-finder.component';

describe('StaffMemberFinderComponent', () => {
  let component: StaffMemberFinderComponent;
  let fixture: ComponentFixture<StaffMemberFinderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffMemberFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffMemberFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
