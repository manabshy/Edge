import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailHomeManagementsComponent } from './contactgroups-detail-home-managements.component';

describe('ContactgroupsDetailHomeManagementsComponent', () => {
  let component: ContactgroupsDetailHomeManagementsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailHomeManagementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailHomeManagementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailHomeManagementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
