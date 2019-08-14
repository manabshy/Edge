import { TestBed } from '@angular/core/testing';

import { EdgeServiceWorkerService } from './edge-service-worker.service';

describe('EdgeServiceWorkerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EdgeServiceWorkerService = TestBed.get(EdgeServiceWorkerService);
    expect(service).toBeTruthy();
  });
});
