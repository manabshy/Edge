import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPanelDetailsComponent } from './admin-panel-details.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from 'src/app/core/core.module';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';

fdescribe('AdminPanelDetailsComponent', () => {
  let component: AdminPanelDetailsComponent;
  let fixture: ComponentFixture<AdminPanelDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelDetailsComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule,
        ModalModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot()

      ],
      providers: [
        {
          provide: ActivatedRoute, useValue: {
            snapshot: { paramMap: { get: () => 123 } }
          }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
