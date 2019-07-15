import { TestBed } from '@angular/core/testing';

import { TapiService } from './tapi.service';

describe('TapiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TapiService = TestBed.get(TapiService);
    expect(service).toBeTruthy();
  });
});
