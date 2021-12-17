
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';

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

  beforeEach(waitForAsync(() => {
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

});
