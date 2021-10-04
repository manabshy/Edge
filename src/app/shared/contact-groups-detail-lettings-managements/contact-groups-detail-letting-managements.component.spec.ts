import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetaillettingsManagementsComponent } from './contact-groups-detail-lettings-managements.component';

describe('ContactGroupsDetaillettingsManagementsComponent', () => {
  let component: ContactGroupsDetaillettingsManagementsComponent;
  let fixture: ComponentFixture<ContactGroupsDetaillettingsManagementsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetaillettingsManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetaillettingsManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
