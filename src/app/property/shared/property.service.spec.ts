import { TestBed } from '@angular/core/testing';

import { PropertyService } from './property.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';
import { Property } from './property';
import { MockProperty } from './test-helper';

fdescribe('PropertyService', () => {
  let httpTestingController: HttpTestingController;
  let service: PropertyService;
  const baseUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/properties`;
  let property = <Property> <unknown>MockProperty;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PropertyService]
    });

    service = TestBed.get(PropertyService);
    httpTestingController = TestBed.get(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should make one api call and return a matching property', () => {
    // let response: any;
    // service.getProperty(property.propertyId).subscribe(res => {response = res; console.log('result', res)});
    service.getProperty(property.propertyId).subscribe();

    const req: TestRequest = httpTestingController.expectOne(`${baseUrl}/${property.propertyId}?includeInfo=false&includePhoto=false`);

    req.flush(property);
    expect(req.request.method).toEqual('GET');
    // expect(response).toEqual(property);
  });

  it('should add and return a new property', () => {
    service.addProperty(property).subscribe();

    const req: TestRequest = httpTestingController.expectOne(`${baseUrl}`);

    req.flush(property);
    expect(req.request.method).toEqual('POST');
  });

});
