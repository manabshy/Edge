import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailComponent } from './contactgroups-detail.component';

describe('ContactgroupsDetailComponent', () => {
  let component: ContactgroupsDetailComponent;
  let fixture: ComponentFixture<ContactgroupsDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
