import { async, ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';

import { ValuationDetailEditComponent } from './valuation-detail-edit.component';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';
import { SharedServiceStub } from 'src/testing/shared-service-stub';
import { Router, ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub } from 'src/testing/activated-route-stub';
import { ValuationService } from '../shared/valuation.service';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { StaffMemberService } from 'src/app/core/services/staff-member.service';
import { ToastrService, ToastrModule } from 'ngx-toastr';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoService } from 'src/app/core/services/info.service';
import { BsModalService, BsModalRef, ModalDirective, ModalModule } from 'ngx-bootstrap/modal';
import { createStorageMapSpy } from 'src/testing/test-spies';
import { of } from 'rxjs';
import { PropertyService } from 'src/app/property/shared/property.service';
import { By } from '@angular/platform-browser';
import { BaseProperty } from 'src/app/shared/models/base-property';
import { Property } from 'src/app/property/shared/property';
import { BsDatepickerModule, MonthPickerComponent } from 'ngx-bootstrap/datepicker';
import { PropertyFinderComponent } from 'src/app/shared/property-finder/property-finder.component';
// import { MockComponent, MockedComponent, MockRender } from 'ng-mocks';
import { SignerComponent } from 'src/app/shared/signer/signer.component';
import { BreadcrumbComponent } from 'src/app/shared/breadcrumb/breadcrumb.component';
import { HttpClient } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { MockVals, mockAllValuers, MockValuations } from 'src/testing/fixture-data/valuations-data';
import { Valuation, Valuer, ValuationStatusEnum } from '../shared/valuation';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { MockDropdownListInfo } from 'src/testing/fixture-data/dropdown-list-data.json';

let component: ValuationDetailEditComponent;
let fixture: ComponentFixture<ValuationDetailEditComponent>;
let propertyService;
let valuationService: ValuationService;
// let Location :Location
const property = {
  'propertyId': 68847,
  'bedrooms': 1,
  'bathrooms': null,
  'receptions': 1,
  'sqFt': null,
  'tenureId': null,
  // "approxLeaseExpiryDate":null,
  'parking': null,
  'outsideSpace': null,
  'propertyFeature': null,
  'valuers': [
    { 'staffMemberId': 2467, 'firstName': 'Georgia', 'lastName': 'Jakstys', 'fullName': 'Georgia Jakstys', emailAddress: null, hasReminder: false, exchangeGUID: '' },
    { 'staffMemberId': 2530, 'firstName': 'Charlotte', 'lastName': 'Sweeney', 'fullName': 'Charlotte Sweeney', emailAddress: null, hasReminder: false, exchangeGUID: '' }]
} as Property;
const owner = {
  'contactGroupId': 239920,
  'contactNames': 'Mrs Fatima Saada',
  'companyName': null,
  'phoneNumber': null,
  'emailAddress': null
};

const mockVals = MockVals;
const tenures = [{ id: 1, value: 'Freehold' },
{ id: 2, value: 'Share of Freehold' },
{ id: 3, value: 'Leasehold' }];

fdescribe('ValuationDetailEditComponent', () => {
  const routerSpy = createRouterSpy();
  const storageMapSpy = createStorageMapSpy();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValuationDetailEditComponent,
        // MockComponent(PropertyFinderComponent),
        // MockComponent(BreadcrumbComponent),
        // MockComponent(SignerComponent)
      ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
        NgSelectModule,
        ButtonsModule.forRoot(),
        BsDatepickerModule.forRoot()
      ],
      providers: [
        // { provide: ValuationService, useValue: {} },
        BsModalService,
        BsModalRef,
        ToastrService,
        PropertyService

        // {provide: PropertyService, useValue:{
        //   getProperty: ()=>of(property),
        //   setAddedProperty :()=>{}
        // }}
        // { provide: ContactGroupsService, useValue: {} },
        // { provide: SharedService, useValue: SharedServiceStub },
        // { provide: StaffMemberService, useValue: {} },
        // { provide: ToastrService, useValue: {} },
        // { provide: StorageMap, useValue: storageMapSpy },
        // { provide: InfoService, useValue: {} },
        // { provide: Router, useValue: routerSpy },
        // { provide: ActivatedRoute, useValue: activatedRoute },
        // {
        //   provide: ActivatedRoute, useValue: {
        //     snapshot: {
        //       paramMap: {
        //         get: () => 1
        //       },
        //       queryParamMap: {
        //         get: (key: string) => {
        //           switch (key) {
        //             case 'propertyId':
        //               return 2;
        //             case 'lastKnownOwnerId':
        //               return 12;
        //             case 'isNewValuation':
        //               return true;
        //           }
        //         }
        //       }
        //     },
        //     params: of({
        //       id: 2,
        //     })
        //   }
        // },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    // activatedRoute = new ActivatedRouteStub();
    fixture = TestBed.createComponent(ValuationDetailEditComponent);
    component = fixture.componentInstance;
    component.isNewValuation = true;
    // TestBed.inject(ValuationService);
    // TestBed.inject(PropertyService);
    // TestBed.inject(ContactGroupsService);
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo));
    fixture.detectChanges();
    propertyService = TestBed.inject(PropertyService);
    valuationService = TestBed.inject(ValuationService);

    // let service = new PropertyService(null)
  });

  describe('Template', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
    it('should contain a title', () => {
      const titleElem = fixture.debugElement.query(By.css('h4'));
      expect(titleElem.nativeElement.textContent).toBe('Valuation');
    });
    it('should have a Actions button', () => {
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const actionsButton = buttons[0].nativeElement;
      expect(actionsButton.textContent).toBe(' Actions ');
    });
    it('should NOT have a Actions button if its newValuation', () => {
      component.isNewValuation = true;
      fixture.detectChanges();
      const buttons = fixture.debugElement.queryAll(By.css('button'));
      const actionsButton = buttons[0].nativeElement;
      expect(actionsButton.textContent).not.toBe(' Actions ');
    });

    it('should create valuation form', () => {
      component.ngOnInit();
      expect(component.valuationForm).toBeTruthy();
    });

    it('should display form if property and owner selected', () => {
      showForm(component);
      fixture.detectChanges();
      expect(fixture.debugElement.queryAll(By.css('fieldset')).length).toBeGreaterThanOrEqual(4);

    });
    it('should fill the form if calling populateform', () => {
      showForm(component);
      fixture.detectChanges();
      // component.valuation=mockVals[0] as unknown as Valuation
      component.populateForm(component.valuation);
      fixture.detectChanges();

      expect(component.valuationForm.value.reason).toBe(mockVals[0].reason);
      expect(component.valuationForm.value.bathrooms).toBe(mockVals[0].bathrooms);
      expect(component.valuationForm.value.lettingsValuer).toBe(mockVals[0].lettingsValuer);
      expect(component.valuationForm.value.timeFrame).toBe(mockVals[0].timeFrame);
      expect(component.valuationForm.value.generalNotes).toBe(mockVals[0].generalNotes);
    });

    it('should populate tenures', () => {
      showForm(component);
      component.tenures = tenures;
      fixture.detectChanges();

      const tenureId = fixture.debugElement.queryAll(By.css('#tenureId option'));
      expect(tenureId.length).toBeGreaterThanOrEqual(2);
    });

    it('should display lease expiry if leasehold selected', () => {
      showForm(component);
      component.populateForm(component.valuation);
      fixture.detectChanges();

      component.valuationForm.patchValue({ tenureId: 3 });
      component.onTenureChange(3);
      fixture.detectChanges();
      const expiryInput = fixture.debugElement.query(By.css('input[name="approxLeaseExpiryDate"]'));
      expect(expiryInput).toBeTruthy();
    });
    it('should NOT display lease expiry if freehold selected', () => {
      showForm(component);
      component.populateForm(component.valuation);
      fixture.detectChanges();

      component.valuationForm.patchValue({ tenureId: 2 });
      component.onTenureChange(2);
      fixture.detectChanges();
      const expiryInput = fixture.debugElement.query(By.css('input[name="approxLeaseExpiryDate"]'));

      expect(expiryInput).toBeFalsy();
    });
    it('should show lettings valuer dropdown only if \'lettings\' were clicked', () => {
      showForm(component);
      component.populateForm(component.valuation);
      fixture.detectChanges();
      clickOn('#valuationLettings');
      expect(component.isLettingsOnly).toBeTruthy();
    });

    it('should show sales valuer dropdown only if \'sales\' were clicked', () => {
      showForm(component);
      component.populateForm(component.valuation);
      fixture.detectChanges();
      clickOn('#valuationSales');
      expect(component.isSalesOnly).toBeTruthy();
    });
    it('should show sales and lettings valuer dropdowns only if \'both\' were clicked', () => {
      showForm(component);
      component.populateForm(component.valuation);
      fixture.detectChanges();
      clickOn('#valuationBoth');
      expect(component.isSalesAndLettings).toBeTruthy();
    });

    it('should display error if reason are not set', () => {
      showForm(component);
      fixture.detectChanges();
      clickOn('button[type="submit"]'); // save
      fixture.detectChanges();
      const error = fixture.debugElement.query(By.css('#reason + div'));
      expect(error.nativeElement.textContent.length).toBeGreaterThanOrEqual(5);
    });
    it('should display error if timeframe are not set', () => {
      showForm(component);
      fixture.detectChanges();
      clickOn('button[type="submit"]'); // save
      fixture.detectChanges();
      const error = fixture.debugElement.query(By.css('#timeFrame + div'));
      expect(error.nativeElement.textContent.length).toBeGreaterThanOrEqual(5);
    });
    it('should display error if generalNotes are not set', () => {
      showForm(component);
      fixture.detectChanges();
      clickOn('button[type="submit"]'); // save
      fixture.detectChanges();
      const error = fixture.debugElement.query(By.css('#generalNotes + div'));
      expect(error.nativeElement.textContent.length).toBeGreaterThanOrEqual(5);
    });

    it('should be in error if valuers are not selected', () => {
      showForm(component);
      fixture.detectChanges();
      clickOn('#valuationBoth');
      component.toggleValuerType();
      fixture.detectChanges();
      clickOn('button[type="submit"]'); // save
      fixture.detectChanges();
      expect(component.valuationForm.controls.salesValuerId.errors.required).toBeTruthy();
      expect(component.valuationForm.controls.lettingsValuerId.errors.required).toBeTruthy();
    });
    it('should show an error if valuers are selected but no availability selected', () => {
      showForm(component);
      component.populateForm(component.valuation);
      component.valuationForm.patchValue({ valuationDate: null }); // make form invalid
      fixture.detectChanges();
      clickOn('#valuationBoth');
      component.toggleValuerType();
      fixture.detectChanges();
      clickOn('button[type="submit"]'); // save
      fixture.detectChanges();
      const warning = fixture.debugElement.query(By.css('.form-group.alert.alert-warning'));
      expect(warning.nativeElement.textContent.length).toBeGreaterThanOrEqual(5);
    });

    it('should show an error if lease expiry is present but not selected', () => {
      showForm(component);
      component.tenures = tenures;
      component.populateForm(component.valuation);
      fixture.detectChanges();

      component.valuationForm.patchValue({ valuationDate: null }); // make form invalid
      component.valuationForm.patchValue({ tenureId: 3 });
      fixture.detectChanges();
      component.onTenureChange(3);
      const expiryInput = fixture.debugElement.query(By.css('input[name="approxLeaseExpiryDate"]'));
      console.log(expiryInput);
      clickOn('button[type="submit"]'); // save
      fixture.detectChanges();

      const error = fixture.debugElement.query(By.css('#approxLeaseExpiryDate + div'));
      console.log(error);
      expect(error.nativeElement.textContent.length).toBeGreaterThanOrEqual(5);
    });


  });

  describe('Component', () => {
    /**services starts here */
    it('should call getproperty if property id is set', fakeAsync(() => {
      spyOn(propertyService, 'getProperty').and.returnValue(of(property));
      component.propertyId = 5;
      fixture.detectChanges();

      component.getPropertyDetails();
      fixture.detectChanges();
      tick();

      expect(propertyService.getProperty).toHaveBeenCalledTimes(1);
      expect(component.property).toEqual(property);
    }));

    it('should get valuation', fakeAsync(() => {
      const valuation = mockVals[0] as unknown as Valuation;
      spyOn(valuationService, 'getValuation').and.returnValue(of(valuation));

      component.getValuation(1234);
      fixture.detectChanges();
      tick();
      console.log('val', component.valuation);

      expect(component.valuation).toEqual(valuation);
    }));

    // utility functions
    it('should correctly calculate weekly rent given the monthly rent', () => {
      const expectedRent = 923.08;

      const actualRent = component.calculateWeeklyRent(4000);

      expect(+actualRent).toEqual(expectedRent);
    });

    it('should correctly calculate monthly rent given the weekly rent', () => {
      const expectedRent = 4333.33;

      const actualRent = component.calculateMonthlyRent(1000);

      expect(+actualRent).toEqual(expectedRent);
    });
  });
});

function showForm(component) {
  component.allValuers = mockAllValuers as unknown as Valuer;
  component.valuation = mockVals[0] as unknown as Valuation;
  component.isNewValuation = true;
  component.property = property;
  component.lastKnownOwner = owner;
}
function clickOn(button) {
  const valuationButton = fixture.debugElement.query(By.css(button));
  valuationButton.nativeElement.click();
  fixture.detectChanges();
}

class Page {
  // getter properties wait to query the DOM until called.
  get buttons() { return this.queryAll<HTMLButtonElement>('button'); }
  get saveBtn() { return this.buttons[0]; }
  get cancelBtn() { return this.buttons[1]; }
  get nameDisplay() { return this.query<HTMLElement>('span'); }
  get nameInput() { return this.query<HTMLInputElement>('input'); }

  gotoListSpy: jasmine.Spy;
  navigateSpy: jasmine.Spy;

  constructor(fixtureLocal: ComponentFixture<ValuationDetailEditComponent>) {

    // get the navigate spy from the injected router spy object
    const routerSpy = <any>fixtureLocal.debugElement.injector.get(Router);
    this.navigateSpy = routerSpy.navigate;

    // spy on component's `gotoList()` method
    const componentLocal = fixtureLocal.componentInstance;
    // this.gotoListSpy = spyOn(componentLocal, 'gotoList').and.callThrough();
  }

  //// query helpers ////
  private query<T>(selector: string): T {
    return fixture.nativeElement.querySelector(selector);
  }

  private queryAll<T>(selector: string): T[] {
    return fixture.nativeElement.querySelectorAll(selector);
  }
}

function createRouterSpy() {
  return jasmine.createSpyObj('Router', ['navigate']);
}
