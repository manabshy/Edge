import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RedactedTableComponent } from './redacted-table.component';

describe('RedactedTableComponent', () => {
  let component: RedactedTableComponent;
  let fixture: ComponentFixture<RedactedTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RedactedTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RedactedTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
