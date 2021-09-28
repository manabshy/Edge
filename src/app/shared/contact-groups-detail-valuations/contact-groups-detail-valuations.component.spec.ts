import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetailValuationsComponent } from './contact-groups-detail-valuations.component';

describe('ContactGroupsDetailValuationsComponent', () => {
  let component: ContactGroupsDetailValuationsComponent;
  let fixture: ComponentFixture<ContactGroupsDetailValuationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetailValuationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetailValuationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
