import { ComponentFixture, TestBed, fakeAsync, waitForAsync } from '@angular/core/testing'
import { ValuationsComponent } from './valuations.component'
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core'
import { HttpClientTestingModule } from '@angular/common/http/testing'
import { RouterTestingModule } from '@angular/router/testing'
import { BsModalService } from 'ngx-bootstrap/modal'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'
import { MockBsModalService } from 'src/testing/extended-mock-services'
import { SharedServiceStub } from 'src/testing/shared-service-stub'
import { StorageMap } from '@ngx-pwa/local-storage'
import { BsDatepickerModule, DatepickerConfig, BsDatepickerConfig } from 'ngx-bootstrap/datepicker'
import { of } from 'rxjs'
import { By } from '@angular/platform-browser'
import { Router } from '@angular/router'
import { Location } from '@angular/common'
import { MockDropdownListInfo } from 'src/testing/fixture-data/dropdown-list-data.json'
import { OfficeService } from 'src/app/core/services/office.service'
import { SharedService } from 'src/app/core/services/shared.service'
import { StaffMemberService } from 'src/app/core/services/staff-member.service'
import { ValuationFacadeService } from '../shared/valuation-facade.service'
import { ValuationDetailEditComponent } from '../valuation-detail-page/valuation-detail-edit/valuation-detail-edit.component'
import { createStorageMapSpy } from 'src/testing/test-spies'

describe('ValuationsComponent', () => {
  let component: ValuationsComponent
  let valuationFacadeService: ValuationFacadeService
  let fixture: ComponentFixture<ValuationsComponent>
  let debugElement: DebugElement
  let location: Location
  let router: Router
  let officeService;
  let staffMemberService;

  const storageMapSpy = createStorageMapSpy()
  beforeEach(
    waitForAsync(() => {
      officeService = jasmine.createSpyObj(['getOffices']);
      staffMemberService = jasmine.createSpyObj(['getActiveStaffMembers', 'getCurrentStaffMember']);
      TestBed.configureTestingModule({
        imports: [
          HttpClientTestingModule,
          FormsModule,
          ReactiveFormsModule,
          BsDatepickerModule.forRoot(),
          RouterTestingModule.withRoutes([
            {
              path: 'detail/:id',
              children: [{ path: 'edit', component: ValuationDetailEditComponent }]
            }

          ])
        ],
        declarations: [ValuationsComponent],
        providers: [
          { provide: SharedService, useValue: SharedServiceStub },
          { provide: StaffMemberService, useValue: staffMemberService },
          { provide: OfficeService, useValue: officeService },
          { provide: StorageMap, useValue: storageMapSpy },
          { provide: DatepickerConfig, useValue: {} },
          { provide: BsModalService, useValue: MockBsModalService }
        ],
        schemas: [NO_ERRORS_SCHEMA]
      }).compileComponents()
    })
  )

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationsComponent)
    valuationFacadeService = TestBed.inject(ValuationFacadeService)
    router = TestBed.inject(Router)
    location = TestBed.inject(Location)
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo))
    component = fixture.componentInstance
    debugElement = fixture.debugElement
    officeService.getOffices.and.returnValue(of([]));
    staffMemberService.getActiveStaffMembers.and.returnValue(of([]));
    staffMemberService.getCurrentStaffMember.and.returnValue(of([]));

    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })

  xit('should display page header ', () => {
    const element = fixture.nativeElement
    const header = element.querySelector('h4')
    expect(header.textContent).toBe('Valuations register')
  })

  xit('should navigate to new valuation ', fakeAsync(() => {
    const createNewValuationButton = debugElement.query(By.css('a')).nativeElement

    createNewValuationButton.click()
    fixture.detectChanges()

    fixture.whenStable().then(() => {
      expect(location.path()).toEqual('/detail/0/edit?isNewValuation=true')
    })
  }))
})
