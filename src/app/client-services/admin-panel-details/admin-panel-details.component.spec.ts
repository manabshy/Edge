import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelDetailsComponent } from './admin-panel-details.component';

describe('AdminPanelDetailsComponent', () => {
  let component: AdminPanelDetailsComponent;
  let fixture: ComponentFixture<AdminPanelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
