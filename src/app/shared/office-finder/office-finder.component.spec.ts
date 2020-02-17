import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OfficeFinderComponent } from './office-finder.component';

describe('OfficeFinderComponent', () => {
  let component: OfficeFinderComponent;
  let fixture: ComponentFixture<OfficeFinderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OfficeFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
