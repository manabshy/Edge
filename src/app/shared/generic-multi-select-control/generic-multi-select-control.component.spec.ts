import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericMultiSelectControlComponent } from './generic-multi-select-control.component';

describe('GenericMultiSelectControlComponent', () => {
  let component: GenericMultiSelectControlComponent;
  let fixture: ComponentFixture<GenericMultiSelectControlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GenericMultiSelectControlComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericMultiSelectControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
