import { TestBed } from '@angular/core/testing';

import { PropertyService } from './property.service';
import { HttpClientTestingModule, HttpTestingController, TestRequest  } from '@angular/common/http/testing';
import { environment } from 'src/environments/environment.test';
import { Property } from './property';
import { Address } from 'src/app/core/models/address';

fdescribe('PropertyService', () => {
  let httpTestingController: HttpTestingController;
  let service: PropertyService;
  const baseUrl = `https://dandg-api-wedge-dev.azurewebsites.net/v10/properties`;
 const address: Address = {
                  addressLines: '413 test address',
                  flatNumber: '88',
                  houseBuildingName: 'Aurora Apartments',
                  houseNumber: null,
                  inCode: '4FW',
                  latitude: null,
                  longitude: null,
                  outCode: 'SW18',
                  streetName: '10 Buckhold Road',
                  town: 'London',
                  postCode: null,
                  countryId: 0,
                  country: null
                };
  const mockProperty: Property = {
                                  propertyId: 1,
                                  address: address,
                                  floorOther:null,
                                  floorType: null,
                                  numberOfFloors: 2,
                                  propertyType: ''
                                };
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

  fit('should return the matching property', () => {
    console.log('address here.....', address);
    service.getProperty(1).subscribe(data => {
      console.log('data returned from test', data);
      // expect(data.propertyId).toEqual('1');
      // expect(data.address.streetName).toEqual('10 Buckhold Road');
    });
    const req: TestRequest = httpTestingController.expectOne(`${baseUrl}/1`);
    expect(req.request.method).toEqual('GET');

    req.flush(mockProperty);
  });

});
