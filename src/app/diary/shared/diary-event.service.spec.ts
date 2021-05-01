import { TestBed } from '@angular/core/testing';

import { DiaryEventService } from './diary-event.service';

describe('DiaryEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DiaryEventService = TestBed.get(DiaryEventService);
    expect(service).toBeTruthy();
  });
});
