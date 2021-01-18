import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactgroupCardComponent } from './contactgroup-card.component';

describe('ContactgroupCardComponent', () => {
  let component: ContactgroupCardComponent;
  let fixture: ComponentFixture<ContactgroupCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContactgroupCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactgroupCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
