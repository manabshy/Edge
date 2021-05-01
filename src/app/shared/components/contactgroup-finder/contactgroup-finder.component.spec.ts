import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupFinderComponent } from './contactgroup-finder.component';

describe('ContactgroupFinderComponent', () => {
  let component: ContactgroupFinderComponent;
  let fixture: ComponentFixture<ContactgroupFinderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactgroupFinderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupFinderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
