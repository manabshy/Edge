import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailInstructionsComponent } from './contactgroups-detail-instructions.component';

describe('ContactgroupsDetailInstructionsComponent', () => {
  let component: ContactgroupsDetailInstructionsComponent;
  let fixture: ComponentFixture<ContactgroupsDetailInstructionsComponent>;

  beforeEach(async(() => {
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
