import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactgroupsDetailValuationsComponent } from './contactgroups-detail-valuations.component';

describe('ContactgroupsDetailValuationsComponent', () => {
  let component: ContactgroupsDetailValuationsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailValuationsComponent>;

  beforeEach(waitForAsync(() => {
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
