import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsListComponent } from './contact-groups-list.component';

describe('ContactGroupsListComponent', () => {
  let component: ContactGroupsListComponent;
  let fixture: ComponentFixture<ContactGroupsListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
