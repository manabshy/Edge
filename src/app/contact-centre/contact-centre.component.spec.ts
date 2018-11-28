import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactCentreComponent } from './contact-centre.component';

describe('ContactCentreComponent', () => {
  let component: ContactCentreComponent;
  let fixture: ComponentFixture<ContactCentreComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactCentreComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactCentreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
