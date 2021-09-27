import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetailTenanciesComponent } from './contact-groups-detail-tenancies.component';

describe('ContactGroupsDetailTenanciesComponent', () => {
  let component: ContactGroupsDetailTenanciesComponent;
  let fixture: ComponentFixture<ContactGroupsDetailTenanciesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetailTenanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetailTenanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
