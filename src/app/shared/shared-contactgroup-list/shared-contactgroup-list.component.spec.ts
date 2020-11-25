import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedContactgroupListComponent } from './shared-contactgroup-list.component';

describe('SharedContactgroupListComponent', () => {
  let component: SharedContactgroupListComponent;
  let fixture: ComponentFixture<SharedContactgroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedContactgroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedContactgroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
