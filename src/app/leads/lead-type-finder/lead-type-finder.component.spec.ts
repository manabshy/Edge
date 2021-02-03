import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadTypeFinderComponent } from './lead-type-finder.component';

describe('LeadTypeFinderComponent', () => {
  let component: LeadTypeFinderComponent;
  let fixture: ComponentFixture<LeadTypeFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadTypeFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadTypeFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
