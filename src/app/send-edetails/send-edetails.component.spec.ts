import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SendEdetailsComponent } from './send-edetails.component';

describe('SendEdetailsComponent', () => {
  let component: SendEdetailsComponent;
  let fixture: ComponentFixture<SendEdetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SendEdetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SendEdetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
