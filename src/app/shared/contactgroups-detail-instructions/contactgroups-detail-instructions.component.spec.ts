import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactgroupsDetailInstructionsComponent } from './contactgroups-detail-instructions.component';

describe('ContactgroupsDetailInstructionsComponent', () => {
  let component: ContactgroupsDetailInstructionsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
