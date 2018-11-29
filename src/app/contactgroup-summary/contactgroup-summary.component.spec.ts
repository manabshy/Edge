import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupSummaryComponent } from './contactgroup-summary.component';

describe('ContactgroupSummaryComponent', () => {
  let component: ContactgroupSummaryComponent;
  let fixture: ComponentFixture<ContactgroupSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
