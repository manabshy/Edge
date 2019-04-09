import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailEditComponent } from './contactgroups-detail-edit.component';

describe('ContactgroupsDetailEditComponent', () => {
  let component: ContactgroupsDetailEditComponent;
  let fixture: ComponentFixture<ContactgroupsDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
