import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactGroupCardComponent } from './contact-group-card.component';

describe('ContactGroupCardComponent', () => {
  let component: ContactGroupCardComponent;
  let fixture: ComponentFixture<ContactGroupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactGroupCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
