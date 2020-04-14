import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationsComponent } from './valuations.component';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
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
import { MockDropdownListInfo } from '../contactgroups/shared/test-helper/dropdown-list-data.json';
import { createStorageMapSpy } from '../../testing/test-spies';

describe('ValuationsComponent', () => {
  let component: ValuationsComponent;
  let valuationService: ValuationService;
  let fixture: ComponentFixture<ValuationsComponent>;
  const storageMapSpy = createStorageMapSpy();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        BsDatepickerModule.forRoot(),
        RouterTestingModule.withRoutes([])
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
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo));
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});



