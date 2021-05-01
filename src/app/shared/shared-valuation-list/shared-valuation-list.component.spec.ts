import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SharedValuationListComponent } from './shared-valuation-list.component';

describe('SharedValuationListComponent', () => {
  let component: SharedValuationListComponent;
  let fixture: ComponentFixture<SharedValuationListComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SharedValuationListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedValuationListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
