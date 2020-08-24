import { TestBed } from '@angular/core/testing';

import { ConfigsLoaderService } from './configs-loader.service';

describe('ConfigsLoaderService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConfigsLoaderService = TestBed.get(ConfigsLoaderService);
    expect(service).toBeTruthy();
  });
});
