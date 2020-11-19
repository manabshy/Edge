import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TelephoneModalComponent } from './telephone-modal.component';

describe('TelephoneModalComponent', () => {
  let component: TelephoneModalComponent;
  let fixture: ComponentFixture<TelephoneModalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephoneModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephoneModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
