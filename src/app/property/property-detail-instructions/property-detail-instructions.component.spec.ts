import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PropertyDetailInstructionsComponent } from './property-detail-instructions.component';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserModule, By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedService } from 'src/app/core/services/shared.service';
import { MockInstructions } from '../shared/test-helper';
import { InstructionInfo } from '../shared/property';
import { PropertyService } from '../shared/property.service';
import { MockDropdownListInfo } from 'src/testing/fixture-data/dropdown-list-data.json';

describe('PropertyDetailInstructionsComponent should', () => {
  let component: PropertyDetailInstructionsComponent;
  let fixture: ComponentFixture<PropertyDetailInstructionsComponent>;
  let propertyService: PropertyService;
  const instructions = MockInstructions as unknown as InstructionInfo[];
  const mockSharedService = {
    getDropdownListInfo: () => of(MockDropdownListInfo),
    scrollToFirstInvalidField: () => null,
    ISOToDate: () => Date(),
    isUKMobile: () => false,
    formatPostCode: () => ''
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PropertyDetailInstructionsComponent],
      imports: [
        HttpClientTestingModule,
        // BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedService, useValue: mockSharedService },
        {
          provide: ActivatedRoute, useValue: {
            snapshot: {
              paramMap: convertToParamMap({
                id: '1'
              })
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PropertyDetailInstructionsComponent);
    component = fixture.componentInstance;
    propertyService = TestBed.get(PropertyService);
    // fixture.detectChanges();
  });

  it('create', () => {
    expect(component).toBeTruthy();
  });

  it('set instructions correctly from service', async(() => {
    const spy = spyOn(propertyService, 'getPropertyInstructions').and.returnValue(of(instructions));
    let response: any;
    component.instructions$
      .subscribe(res => {
        response = res;
        console.log('res', response);
        expect(response).toEqual(instructions);
      });

    expect(spy).toHaveBeenCalledWith(1);
  }));

  it('display the instructions correctly', async(() => {
    spyOn(propertyService, 'getPropertyInstructions').and.returnValue(of(instructions));
    component.instructions$.subscribe();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const instructionDivs = fixture.debugElement.queryAll(By.css('.list-group-item-action *'));
      console.log('first row', instructionDivs[0].nativeElement.textContent);

      expect(instructionDivs[0].nativeElement.textContent).toContain(instructions[0].type);
    });
  }));
});
