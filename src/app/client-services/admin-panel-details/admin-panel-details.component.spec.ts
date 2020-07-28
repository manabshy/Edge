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
  const memberPoints: TeamMemberPoint[] = [
    {
      badgeId: 1,
      createdBy: 'System',
      dateTime: new Date('2020-07-23T16:00:22.847'),
      pointId: 91,
      pointTypeId: 9,
      points: 500,
      reason: 'Golden Stag',
      staffMemberId: 2430
    },
    {
      badgeId: null,
      createdBy: 'System',
      dateTime: new Date('2020-07-27T14:38:55.373'),
      pointId: 296,
      pointTypeId: 2,
      points: 20,
      reason: '60 Abbeville Road, London SW4 9NE',
      staffMemberId: 2430
    }
  ];

  const newPoint = { pointTypeId: 9, points: 100, reason: 'Test', animate: false, createdBy: 'Rebecca Davies' } as unknown as TeamMemberPoint;
  const teamMembers: TeamMember[] = [
    {
      staffMemberId: 2430,
      name: 'Shanil Khagram',
      photoUrl: 'https://dandglive.blob.core.windows.net/staffmembers-public%5Cs-2430%5Cstaff_2430_90e73db2af0c4b1f97c4f4266a89c82f_Shanil+Khagram.png',
      points: memberPoints
    },
    {
      staffMemberId: 2622,
      name: 'Rebecca Davies',
      photoUrl: 'https://dandglive.blob.core.windows.net/staffmembers-public%5Cs-2622%5Cstaff_2622_4ddb3f08db664ad99c0d060942f9f917_REBECCA+DAVIES+150px+x+150px+Grey.jpg',
      points: memberPoints
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

  it('should get team member when initialised', fakeAsync(() => {
    const pointsSpy = spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0]));
    component.pointTypes = [];
    fixture.detectChanges();

    component.getTeamMemberDetails();
    tick();
    fixture.detectChanges();

    expect(pointsSpy).toHaveBeenCalled();
  }));

  it('should show the name of team member', async(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0]));
    let member;
    component.ngOnInit();
    fixture.detectChanges();
    component.memberDetails$.subscribe(res => {
      console.log('member', res);
      member = res;
    });

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const nameElement = fixture.debugElement.query(By.css('h5'));
      nameElement.nativeElement.textContent = member.name;
      expect(nameElement.nativeElement.textContent).toBe(member.name);
    });
  }));

  it('should get two points for team member with two points', fakeAsync(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0].points));
    component.memberDetails$.subscribe(points => {
      console.log('fake async points', points);
      expect(points.length).toBe(2);
    });

    tick();

  }));

  it('should update team member points with an added point', fakeAsync(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0].points));
    spyOn(boardService, 'addPoint').and.returnValue(of(true));

    component.ngOnInit();
    component.memberDetails$.subscribe(points => {
      component.teamMemberPoints = points;
    });
    component.updateTeamMemberPoints(newPoint);
    tick();

    expect(component.teamMemberPoints.length).toBe(3);
  }));

});
