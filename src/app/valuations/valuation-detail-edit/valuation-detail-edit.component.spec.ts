import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationDetailEditComponent } from './valuation-detail-edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
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
import { MockDropdownListInfo } from 'src/app/contactgroups/shared/test-helper/dropdown-list-data.json';
import { PropertyService } from 'src/app/property/shared/property.service';
import { By } from '@angular/platform-browser';

let component: ValuationDetailEditComponent;
let fixture: ComponentFixture<ValuationDetailEditComponent>;
let activatedRoute: ActivatedRouteStub;

fdescribe('ValuationDetailEditComponent', () => {
  const routerSpy = createRouterSpy();
  const storageMapSpy = createStorageMapSpy();
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ValuationDetailEditComponent],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([]),
        ModalModule.forRoot(),
        ToastrModule.forRoot(),
      ],
      providers: [
        // { provide: ValuationService, useValue: {} },
        BsModalService, 
        BsModalRef,
        ToastrService,
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
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    // activatedRoute = new ActivatedRouteStub();
    fixture = TestBed.createComponent(ValuationDetailEditComponent);
    component = fixture.componentInstance;
    // TestBed.inject(ValuationService);
    // TestBed.inject(PropertyService);
    // TestBed.inject(ContactGroupsService);
    storageMapSpy.get.and.returnValue(of(MockDropdownListInfo));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it("should contain a title", ()=>{
    const titleElem = fixture.debugElement.query(By.css( "h4"));
    expect(titleElem.nativeElement.textContent).toBe('Valuation')
  });
  it("should have a Actions button", ()=>{
    const buttons = fixture.debugElement.queryAll(By.css('button'))
    const actionsButton = buttons[0].nativeElement;
    expect(actionsButton.textContent).toBe(' Actions ')
  });
  xit('should navigate to /add', ()=>{
    const router = TestBed.get(Router)
    spyOn(router, 'navigateByUrl')
    //click() on button
    expect(router.navigateByUrl)
      .toHaveBeenCalledWith(router.createUrlTree(['/add']), {skipLocationChange:false, replaceUrl:false})
  })
});

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
