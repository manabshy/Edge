import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstructionsAndBusinessDevelopmentComponent } from './instructions-and-business-development.component';

describe('InstructionsAndBusinessDevelopmentComponent', () => {
  let component: InstructionsAndBusinessDevelopmentComponent;
  let fixture: ComponentFixture<InstructionsAndBusinessDevelopmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstructionsAndBusinessDevelopmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstructionsAndBusinessDevelopmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
