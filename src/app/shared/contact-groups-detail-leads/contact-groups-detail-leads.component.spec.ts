import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetailLeadsComponent } from './contact-groups-detail-leads.component';

describe('ContactGroupsDetailLeadsComponent', () => {
  let component: ContactGroupsDetailLeadsComponent;
  let fixture: ComponentFixture<ContactGroupsDetailLeadsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetailLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetailLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
