import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { AdminPanelListComponent } from './admin-panel-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CsBoardService } from '../shared/services/cs-board.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TeamMembers } from 'src/testing/admin-panel-data';
import { of, EMPTY } from 'rxjs';
import { By } from '@angular/platform-browser';
import { TeamMember } from '../shared/models/team-member';

describe('AdminPanelListComponent', () => {
  let component: AdminPanelListComponent;
  let fixture: ComponentFixture<AdminPanelListComponent>;
  let boardService: CsBoardService;
  const teamMembers = TeamMembers;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdminPanelListComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [CsBoardService],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminPanelListComponent);
    component = fixture.componentInstance;
    boardService = TestBed.inject(CsBoardService);
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display team members when initialised', fakeAsync(() => {
    spyOn(boardService, 'getCsBoard').and.returnValue(of(teamMembers));
    component.ngOnInit();
    component.members$.subscribe(members => {
      expect(members.length).toBe(2);
    });
    tick();
  }));

  it('should show the name of the first team member', async(() => {
    spyOn(boardService, 'getCsBoard').and.returnValue(of(teamMembers));
    let member: TeamMember;
    component.ngOnInit();
    fixture.detectChanges();
    component.members$.subscribe(res => member = res[0]);

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const nameElement = fixture.debugElement.query(By.css('h5'));
      nameElement.nativeElement.textContent = member.name;
      expect(nameElement.nativeElement.textContent).toBe(member.name);
    });
  }));

  it('should display 2 anchor tags for a team with 2 members', async(() => {
    spyOn(boardService, 'getCsBoard').and.returnValue(of(teamMembers));
    component.ngOnInit();
    fixture.detectChanges();
    component.members$.subscribe();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const anchorTags = fixture.debugElement.queryAll(By.css('a'));
      expect(anchorTags.length).toBe(2);
    });
  }));

  it('should not display board when when there are no team members', async(() => {
    spyOn(boardService, 'getCsBoard').and.returnValue(of([]));
    component.ngOnInit();
    fixture.detectChanges();
    component.members$.subscribe();

    fixture.whenStable().then(() => {
      fixture.detectChanges();
      const anchorTags = fixture.debugElement.queryAll(By.css('a'));
      expect(anchorTags.length).toBe(0);
    });
  }));
});
