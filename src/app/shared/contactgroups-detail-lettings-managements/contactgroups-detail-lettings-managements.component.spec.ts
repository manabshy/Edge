import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactgroupsDetaillettingsManagementsComponent } from './contactgroups-detail-lettings-managements.component';

describe('ContactgroupsDetaillettingsManagementsComponent', () => {
  let component: ContactgroupsDetaillettingsManagementsComponent;
  let fixture: ComponentFixture<ContactgroupsDetaillettingsManagementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetaillettingsManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetaillettingsManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
