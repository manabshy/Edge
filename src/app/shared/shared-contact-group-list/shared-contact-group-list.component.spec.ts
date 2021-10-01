import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SharedContactGroupListComponent } from './shared-contact-group-list.component';

describe('SharedContactGroupListComponent', () => {
  let component: SharedContactGroupListComponent;
  let fixture: ComponentFixture<SharedContactGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SharedContactGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SharedContactGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
