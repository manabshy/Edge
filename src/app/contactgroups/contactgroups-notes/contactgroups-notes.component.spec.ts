import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsNotesComponent } from './contactgroups-notes.component';

describe('ContactgroupsNotesComponent', () => {
  let component: ContactgroupsNotesComponent;
  let fixture: ComponentFixture<ContactgroupsNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactgroupsNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
