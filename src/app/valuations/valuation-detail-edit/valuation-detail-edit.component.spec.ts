import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValuationDetailEditComponent } from './valuation-detail-edit.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

fdescribe('ValuationDetailEditComponent', () => {
  let component: ValuationDetailEditComponent;
  let fixture: ComponentFixture<ValuationDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValuationDetailEditComponent ],
      imports: [
        HttpClientTestingModule,
        FormsModule,
        // ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValuationDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
