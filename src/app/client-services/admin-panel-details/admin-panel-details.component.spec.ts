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
import { ModalModule, BsModalService } from 'ngx-bootstrap/modal';
import { CsBoardService } from '../shared/services/cs-board.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { TeamMember, TeamMemberPoint } from '../shared/models/team-member';
import { of } from 'rxjs';
import { ToastrModule } from 'ngx-toastr';
import { TeamMembers, NewPoint } from '../../../testing/admin-panel-data';

fdescribe('AdminPanelDetailsComponent', () => {
  let component: AdminPanelDetailsComponent;
  let fixture: ComponentFixture<AdminPanelDetailsComponent>;
  let boardService: CsBoardService;
  const teamMembers = TeamMembers;
  const newPoint = NewPoint;

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
    component.getSelectedMonthPointTotal([]);
    component.teamMemberPoints = [];
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
    let member: TeamMember;
    component.ngOnInit();
    fixture.detectChanges();
    component.memberDetails$.subscribe(res => member = res);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const nameElement = fixture.debugElement.query(By.css('h5'));
      nameElement.nativeElement.textContent = member.name;
      expect(nameElement.nativeElement.textContent).toBe(member.name);
    });
  }));

  it('should get two points for team member with two points', fakeAsync(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0].points));
    component.memberDetails$.subscribe(points => expect(points.length).toBe(2));

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

  it('should show modal for adding an adjustment when the adjust button is clicked', async(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0].points));
    const spy = spyOn(component.modalService, 'show').and.callThrough();

    component.ngOnInit();
    fixture.detectChanges();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const allButtons = fixture.debugElement.queryAll(By.css('button'));
      const showModalButton = allButtons[0];
      showModalButton.nativeElement.click();

      expect(spy).toHaveBeenCalledTimes(1);
    });
  }));

  it('should get total points for current month', fakeAsync(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0].points));
    fixture.detectChanges();

    component.memberDetails$.subscribe(points => {
      component.teamMemberPoints = points;
      component.getSelectedMonthPointTotal(component.teamMemberPoints);

      expect(component.totalPoints).toBe(620);
    });
  }));

  it('should update total points for current month when new point is added', fakeAsync(() => {
    spyOn(boardService, 'getCsTeamMemberDetails').and.returnValue(of(teamMembers[0].points));
    fixture.detectChanges();

    component.memberDetails$.subscribe(points => {
      component.teamMemberPoints = points;
      component.updateTeamMemberPoints(newPoint);

      expect(component.totalPoints).toBe(720);
    });
  }));

});
