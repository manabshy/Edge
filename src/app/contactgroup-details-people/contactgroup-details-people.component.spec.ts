import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupDetailsPeopleComponent } from './contactgroup-details-people.component';

describe('ContactgroupDetailsPeopleComponent', () => {
  let component: ContactgroupDetailsPeopleComponent;
  let fixture: ComponentFixture<ContactgroupDetailsPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupDetailsPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupDetailsPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
