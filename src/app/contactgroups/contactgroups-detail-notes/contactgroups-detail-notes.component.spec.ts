import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes.component';

describe('ContactgroupsDetailNotesComponent', () => {
  let component: ContactgroupsDetailNotesComponent;
  let fixture: ComponentFixture<ContactgroupsDetailNotesComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsDetailNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsDetailNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
