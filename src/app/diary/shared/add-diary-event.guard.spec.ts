import { TestBed, async, inject } from '@angular/core/testing';

import { AddDiaryEventGuard } from './add-diary-event.guard';

describe('AddDiaryEventGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AddDiaryEventGuard]
    });
  });

  it('should ...', inject([AddDiaryEventGuard], (guard: AddDiaryEventGuard) => {
    expect(guard).toBeTruthy();
  }));
});
