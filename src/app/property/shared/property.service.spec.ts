import { TestBed } from '@angular/core/testing';

import { PropertyService } from './property.service';
import { HttpClientTestingModule, HttpTestingController  } from '@angular/common/http/testing';

describe('PropertyService', () => {
  let httpTestingController: HttpTestingController;
  let service: PropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [PropertyService],
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(PropertyService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
