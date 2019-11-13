import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsListComponent } from './contactgroups-list.component';

describe('ContactgroupsListComponent', () => {
  let component: ContactgroupsListComponent;
  let fixture: ComponentFixture<ContactgroupsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
