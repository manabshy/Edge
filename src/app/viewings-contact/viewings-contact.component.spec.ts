import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewingsContactComponent } from './viewings-contact.component';

describe('ViewingsContactComponent', () => {
  let component: ViewingsContactComponent;
  let fixture: ComponentFixture<ViewingsContactComponent>;

  beforeEach(waitForAsync(() => {
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
