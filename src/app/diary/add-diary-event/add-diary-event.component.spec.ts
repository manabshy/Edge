import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDiaryEventComponent } from './add-diary-event.component';

describe('AddDiaryEventComponent', () => {
  let component: AddDiaryEventComponent;
  let fixture: ComponentFixture<AddDiaryEventComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDiaryEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDiaryEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
