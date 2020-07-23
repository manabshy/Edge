import { async, ComponentFixture, TestBed, fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';
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
import { ToastrModule } from 'ngx-toastr';

fdescribe('AdminPanelDetailsComponent', () => {
  let component: AdminPanelDetailsComponent;
  let fixture: ComponentFixture<AdminPanelDetailsComponent>;
  let boardService: CsBoardService;
  const memberRecords: any[] = [
    {
      date: '21/06/2020',
      reason: 'Inbound Valuation',
      points: 200
    },
    {
      date: '21/06/2020',
      reason: 'Outbound Valuation',
      points: 250
    }
  ];

  const teamMembers: TeamMember[] = [
    {
      staffMemberId: 1,
      name: 'Melissa D\'Angelo',
      photoUrl: 'assets/images/leaf_rake.png',
      points: memberRecords
    }
  ];
  const boardServiceSpy = jasmine.createSpyObj('CsBoardService', ['getCsTeamMemberDetails', 'getCsTeamMemberPoints']);
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
        ToastrModule.forRoot(),
        BsDatepickerModule.forRoot(),
        BsDropdownModule.forRoot()

      ],
      providers: [
        CsBoardService,
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
    boardService = TestBed.inject(CsBoardService);
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should get team member points when initialised', fakeAsync(() => {
    const pointsSpy = spyOn(boardService, 'getCsTeamMemberPoints').and.returnValue(of(teamMembers[0].points));
    component.pointTypes = [];
    fixture.detectChanges();

    component.getTeamMemberPoints();
    component.points$.subscribe();
    tick();
    fixture.detectChanges();

    expect(pointsSpy).toHaveBeenCalled();
  }));

  it('should populate two table rows for team member with two points', fakeAsync(() => {
    const pElement = fixture.debugElement.query(By.css('tbody'));
    spyOn(boardService, 'getCsTeamMemberPoints').and.returnValue(of(teamMembers[0].points));
    component.pointTypes = [];
    fixture.detectChanges();

    component.getTeamMemberPoints();
    component.points$.subscribe();
    tick();
    fixture.detectChanges();

    expect(pElement.children.length).toBe(2);
  }));
});
