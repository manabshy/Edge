import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfficeFinderComponent } from './office-finder.component';

describe('OfficeFinderComponent', () => {
  let component: OfficeFinderComponent;
  let fixture: ComponentFixture<OfficeFinderComponent>;

  beforeEach(waitForAsync(() => {
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
