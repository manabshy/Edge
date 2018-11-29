import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewingsContactComponent } from './viewings-contact.component';

describe('ViewingsContactComponent', () => {
  let component: ViewingsContactComponent;
  let fixture: ComponentFixture<ViewingsContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewingsContactComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewingsContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
