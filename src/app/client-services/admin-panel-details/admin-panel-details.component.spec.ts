import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { AdminPanelDetailsComponent } from './admin-panel-details.component';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { RouterTestingModule } from '@angular/router/testing';
import { ModalModule } from 'ngx-bootstrap/modal';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TeamMember, TeamMemberPoint } from '../shared/models/team-member';
import { of } from 'rxjs';

fdescribe('AdminPanelDetailsComponent', () => {
  let component: AdminPanelDetailsComponent;
  let fixture: ComponentFixture<AdminPanelDetailsComponent>;
  const memberRecords: any[] = [
    {
      date: '21/06/2020',
      reason: 'Inbound Valuation',
      points: 200
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      id: 1,
      firstName: 'Melissa',
      surname: 'D\'Angelo',
      fullName: 'Melissa D\'Angelo',
      position: 1,
      points: 200,
      photoUrl: 'assets/images/leaf_rake.png',
      records: memberRecords
    }
  ];
  const boardServiceSpy = jasmine.createSpyObj('CsBoardService', ['getCsTeamMemberDetails']);
  const teamMemberSpy = boardServiceSpy.getCsTeamMemberDetails.and.returnValue(of(teamMembers[0]));
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
        { provide: CsBoardService, useValue: boardServiceSpy },
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

  it('should get team member details when initialised', fakeAsync(() => {
    const pElement = fixture.debugElement.query(By.css('#test-para'));

    component.getTeamMemberDetails();
    tick();
    fixture.detectChanges();

    expect(pElement.nativeElement.textContent).toContain(teamMembers[0].firstName);
  }));
});
