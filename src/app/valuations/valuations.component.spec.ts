import { async, ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';

import { ValuationsComponent } from './valuations.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsModalService } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MockBsModalService } from 'src/testing/extended-mock-services';
import { SharedService } from '../core/services/shared.service';
import { SharedServiceStub } from 'src/testing/shared-service-stub';
import { StaffMemberService } from '../core/services/staff-member.service';
import { ToastrService } from 'ngx-toastr';
import { StorageMap } from '@ngx-pwa/local-storage';
import { OfficeService } from '../core/services/office.service';
import { ValuationService } from './shared/valuation.service';
import { BsDatepickerModule, DatepickerConfig, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { of } from 'rxjs';
import { createStorageMapSpy } from '../../testing/test-spies';
import { By } from '@angular/platform-browser';
import { ValuationDetailEditComponent } from './valuation-detail-edit/valuation-detail-edit.component';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MockDropdownListInfo } from 'src/testing/fixture-data/dropdown-list-data.json';

describe('ValuationsComponent', () => {
  let component: ValuationsComponent;
  let valuationService: ValuationService;
  let fixture: ComponentFixture<ValuationsComponent>;
  let debugElement: DebugElement;
  let location: Location;
  let router: Router;

  const storageMapSpy = createStorageMapSpy();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        RouterTestingModule.withRoutes([
          {
            path: 'detail/:id',
            children: [
              { path: 'edit', component: ValuationDetailEditComponent }
            ]
          }
          // { path: 'valuations-register/:detail/:id/edit', component: ValuationDetailEditComponent }
          // TODO: add valuations-register to path
        ])
      ],
      declarations: [ValuationsComponent],
      providers: [
        { provide: SharedService, useValue: SharedServiceStub },
        { provide: StaffMemberService, useValue: {} },
        { provide: OfficeService, useValue: {} },
        { provide: StorageMap, useValue: storageMapSpy },
        { provide: DatepickerConfig, useValue: {} },
        { provide: BsModalService, useValue: MockBsModalService },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationsComponent);
    valuationService = TestBed.inject(ValuationService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo));
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {

    expect(component).toBeTruthy();
  });

  it('should display page header ', () => {
    const element = fixture.nativeElement;
    const header = element.querySelector('h4');
    expect(header.textContent).toBe('Valuations register');
  });

  it('should navigate to new valuation ', fakeAsync(() => {
    const createNewValuationButton = debugElement.query(By.css('a')).nativeElement;

    createNewValuationButton.click();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/detail/0/edit?isNewValuation=true');
    });
  }));
});



