import { TestBed } from '@angular/core/testing';

import { ValuationService } from './valuation.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ValuationRequestOption } from './valuation';
import { MockValuations } from 'src/testing/fixture-data/valuations-data';
import { format } from 'date-fns';

fdescribe('ValuationService', () => {
  let service: ValuationService;
  let httpTestingController: HttpTestingController;
  let response = MockValuations;
  const baseUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/valuations`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ]
    });

    httpTestingController = TestBed.get(HttpTestingController);
    service = TestBed.get(ValuationService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should pass correct parameters to get valuations', () => {
    const option = {
      searchTerm: 'test',
      date: format(new Date(), 'YYYY-MM-DD'),
      status: 0,
      valuerId: 0,
      officeId: 0
    } as unknown as ValuationRequestOption;
    const url = `${baseUrl}/search?searchTerm=${option.searchTerm}&pageSize=10&page=1&date=${option.date}&status=${option.status}&valuerId=${option.valuerId}&officeId=${option.officeId}`;

    service.getValuations(option).subscribe();

    const req = httpTestingController.expectOne(url);
    req.flush(response);
    expect(req.request.method).toEqual('GET');
  });
});
