import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedValuationListComponent } from './shared-valuation-list.component';

describe('SharedValuationListComponent', () => {
  let component: SharedValuationListComponent;
  let fixture: ComponentFixture<SharedValuationListComponent>;

  beforeEach(async(() => {
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
