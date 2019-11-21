import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonDuplicateCheckerComponent } from './person-duplicate-checker.component';

describe('PersonDuplicateCheckerComponent', () => {
  let component: PersonDuplicateCheckerComponent;
  let fixture: ComponentFixture<PersonDuplicateCheckerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PersonDuplicateCheckerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonDuplicateCheckerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
