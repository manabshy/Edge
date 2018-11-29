import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewingsPropertyComponent } from './viewings-property.component';

describe('ViewingsPropertyComponent', () => {
  let component: ViewingsPropertyComponent;
  let fixture: ComponentFixture<ViewingsPropertyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewingsPropertyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewingsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
