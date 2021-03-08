import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CompanyFinderComponent } from './company-finder.component';

describe('CompanyFinderComponent', () => {
  let component: CompanyFinderComponent;
  let fixture: ComponentFixture<CompanyFinderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ CompanyFinderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompanyFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
