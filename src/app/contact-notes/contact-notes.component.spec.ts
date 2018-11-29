import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactNotesComponent } from './contact-notes.component';

describe('ContactNotesComponent', () => {
  let component: ContactNotesComponent;
  let fixture: ComponentFixture<ContactNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
