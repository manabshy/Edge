import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelListComponent } from './admin-panel-list.component';

describe('AdminPanelListComponent', () => {
  let component: AdminPanelListComponent;
  let fixture: ComponentFixture<AdminPanelListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminPanelListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
