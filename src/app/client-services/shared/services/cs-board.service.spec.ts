import { TestBed } from '@angular/core/testing';

import { CsBoardService } from './cs-board.service';

describe('CsBoardService', () => {
  let service: CsBoardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CsBoardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
