import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactgroupsDetailHomeHelperComponent } from './contact-groups-detail-home-helper.component';

describe('ContactgroupsDetailHomeHelperComponent', () => {
  let component: ContactgroupsDetailHomeHelperComponent;
  let fixture: ComponentFixture<ContactgroupsDetailHomeHelperComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailHomeHelperComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailHomeHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
