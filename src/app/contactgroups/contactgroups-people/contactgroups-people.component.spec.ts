import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsPeopleComponent } from './contactgroups-people.component';

describe('ContactgroupsPeopleComponent', () => {
  let component: ContactgroupsPeopleComponent;
  let fixture: ComponentFixture<ContactgroupsPeopleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsPeopleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsPeopleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
