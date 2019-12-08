import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedLeadRegisterComponent } from './shared-lead-register.component';

describe('SharedLeadRegisterComponent', () => {
  let component: SharedLeadRegisterComponent;
  let fixture: ComponentFixture<SharedLeadRegisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedLeadRegisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedLeadRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
