import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TelephoneComponent } from './telephone.component';

describe('TelephoneComponent', () => {
  let component: TelephoneComponent;
  let fixture: ComponentFixture<TelephoneComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TelephoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TelephoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
