import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactGroupFinderComponent } from './contact-group-finder.component';

describe('ContactGroupFinderComponent', () => {
  let component: ContactGroupFinderComponent;
  let fixture: ComponentFixture<ContactGroupFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactGroupFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactGroupFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
