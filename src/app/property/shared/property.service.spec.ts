import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';

import { PropertyService } from './property.service';
import { Property } from './property';
import { MockProperty } from './test-helper';

fdescribe('PropertyService', () => {
  let httpTestingController: HttpTestingController;
  let service: PropertyService;
  const baseUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/properties`;
  const property = <Property> <unknown>MockProperty;

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

  describe('#getProperty', () => {
    it('should make one api call and return a matching property', () => {
      // let response: Property;
      // service.getProperty(property.propertyId).subscribe((res: Property) => {response = res; console.log('result', res)});
      const url = `${baseUrl}/${property.propertyId}?includeInfo=false&includePhoto=false`;
      service.getProperty(property.propertyId).subscribe();

      const req: TestRequest = httpTestingController.expectOne(url);

      req.flush(property);
      expect(req.request.method).toEqual('GET');
    });
  });

  describe('#AddProperty', () => {

    it('should add and return a new property', () => {
      service.addProperty(property).subscribe();

      const req: TestRequest = httpTestingController.expectOne(`${baseUrl}`);

      req.flush(property);
      expect(req.request.method).toEqual('POST');
    });

  });

  // describe('#getPotentialDuplicateProperties', () => {
  //   it('return a full match for full address', () => {
  //     // let response: any;
  //     // service.getProperty(property.propertyId).subscribe(res => {response = res; console.log('result', res)});
  //     service.getPotentialDuplicateProperties(property.address).subscribe();

  //     const req: TestRequest = httpTestingController.expectOne(`${baseUrl}/duplicates`);

  //     req.flush(property);
  //     expect(req.request.method).toEqual('GET');
  //     // expect(response).toEqual(property);
  //   });

  // });
});
