import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsDetailNotesComponent } from './contactgroups-detail-notes.component';

describe('ContactgroupsDetailNotesComponent', () => {
  let component: ContactgroupsDetailNotesComponent;
  let fixture: ComponentFixture<ContactgroupsDetailNotesComponent>;

  beforeEach(async(() => {
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
