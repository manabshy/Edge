import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/compiler';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { EMPTY, of } from 'rxjs';
import { PropertyService } from '../property.service';

import { PropertyDuplicateCheckerComponent } from './property-duplicate-checker.component';

fdescribe('PropertyDuplicateCheckerComponent', () => {
  let component: PropertyDuplicateCheckerComponent;
  let fixture: ComponentFixture<PropertyDuplicateCheckerComponent>;
  let propertyService: PropertyService;
  const duplicateProperties = [{
    matchType: 'FullMatch',
    propertyAddress: 'Battersea Delivery Office, 202 Lavender Hill, London SW11 1AA',
    propertyId: 68164,
    ranking: 1083
  }, {
    matchType: 'PartMatch',
    propertyAddress: 'Waterside, Basin Road, Worcester WR5 3DA',
    propertyId: 68158,
    ranking: 294
  }];

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyDuplicateCheckerComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDuplicateCheckerComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.inject(PropertyService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get duplicate properties from service', fakeAsync(() => {

    const spy = spyOn(propertyService, 'getPotentialDuplicateProperties').and.returnValue(of(duplicateProperties));

    fixture.detectChanges();
    component.getDuplicates();
    tick();

    expect(spy).toHaveBeenCalledTimes(1);
  }));

  it('should set isFullMatch to true when a duplicate is found', fakeAsync(() => {
    spyOn(propertyService, 'getPotentialDuplicateProperties').and.returnValue(of(duplicateProperties));

    fixture.detectChanges();
    component.getDuplicates();
    tick();

    expect(component.isFullMatch).toBeTruthy();
  }));


  it('should set isFullMatch to false when part matched duplicate is found', fakeAsync(() => {
    const partMatchDuplicates = duplicateProperties.filter(x => x.matchType === 'PartMatch');
    spyOn(propertyService, 'getPotentialDuplicateProperties').and.returnValue(of(partMatchDuplicates));

    fixture.detectChanges();
    component.getDuplicates();
    tick();

    expect(component.isFullMatch).toBeFalsy();
  }));

  it('should set isFullMatch to false when no duplicates are found', fakeAsync(() => {
    spyOn(propertyService, 'getPotentialDuplicateProperties').and.returnValue(of(EMPTY));

    fixture.detectChanges();
    component.getDuplicates();
    tick();

    expect(component.isFullMatch).toBeFalsy();
  }));

});
