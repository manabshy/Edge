import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupsRedesignComponent } from './contactgroups-redesign.component';

describe('ContactgroupsRedesignComponent', () => {
  let component: ContactgroupsRedesignComponent;
  let fixture: ComponentFixture<ContactgroupsRedesignComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactgroupsRedesignComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupsRedesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
