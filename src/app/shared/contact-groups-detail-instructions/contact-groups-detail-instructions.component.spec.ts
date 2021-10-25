import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactGroupsDetailInstructionsComponent } from './contact-groups-detail-instructions.component';

describe('ContactGroupsDetailInstructionsComponent', () => {
  let component: ContactGroupsDetailInstructionsComponent;
  let fixture: ComponentFixture<ContactGroupsDetailInstructionsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactGroupsDetailInstructionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupsDetailInstructionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
