import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailTenanciesComponent } from './contactgroups-detail-tenancies.component';

describe('ContactgroupsDetailTenanciesComponent', () => {
  let component: ContactgroupsDetailTenanciesComponent;
  let fixture: ComponentFixture<ContactgroupsDetailTenanciesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailTenanciesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailTenanciesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
