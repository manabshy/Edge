import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffmemberFinderComponent } from './staffmember-finder.component';

describe('StaffmemberFinderComponent', () => {
  let component: StaffmemberFinderComponent;
  let fixture: ComponentFixture<StaffmemberFinderComponent>;

  beforeEach(async(() => {
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
