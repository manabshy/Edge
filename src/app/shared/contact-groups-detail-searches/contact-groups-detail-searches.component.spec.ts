import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetailSearchesComponent } from './contact-groups-detail-searches.component';

describe('ContactGroupsDetailSearchesComponent', () => {
  let component: ContactGroupsDetailSearchesComponent;
  let fixture: ComponentFixture<ContactGroupsDetailSearchesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetailSearchesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetailSearchesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
