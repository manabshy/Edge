import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailHomeHelperComponent } from './contactgroups-detail-home-helper.component';

describe('ContactgroupsDetailHomeHelperComponent', () => {
  let component: ContactgroupsDetailHomeHelperComponent;
  let fixture: ComponentFixture<ContactgroupsDetailHomeHelperComponent>;

  beforeEach(async(() => {
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
