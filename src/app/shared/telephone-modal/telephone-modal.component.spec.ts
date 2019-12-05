import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TelephoneModalComponent } from './telephone-modal.component';

describe('TelephoneModalComponent', () => {
  let component: TelephoneModalComponent;
  let fixture: ComponentFixture<TelephoneModalComponent>;

  beforeEach(async(() => {
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
