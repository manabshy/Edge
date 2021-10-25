import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetailOffersComponent } from './contact-groups-detail-offers.component';

describe('ContactGroupsDetailOffersComponent', () => {
  let component: ContactGroupsDetailOffersComponent;
  let fixture: ComponentFixture<ContactGroupsDetailOffersComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetailOffersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetailOffersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
