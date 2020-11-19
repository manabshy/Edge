import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SignerComponent } from './signer.component';

describe('SignerComponent', () => {
  let component: SignerComponent;
  let fixture: ComponentFixture<SignerComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SignerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
