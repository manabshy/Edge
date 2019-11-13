import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailValuationsComponent } from './contactgroups-detail-valuations.component';

describe('ContactgroupsDetailValuationsComponent', () => {
  let component: ContactgroupsDetailValuationsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailValuationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailValuationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailValuationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
