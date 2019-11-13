import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailLeadsComponent } from './contactgroups-detail-leads.component';

describe('ContactgroupsDetailLeadsComponent', () => {
  let component: ContactgroupsDetailLeadsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailLeadsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailLeadsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailLeadsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
