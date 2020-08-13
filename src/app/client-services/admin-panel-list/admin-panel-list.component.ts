import { Component, OnInit } from '@angular/core';
import { CsBoardService } from '../shared/services/cs-board.service';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TeamMember } from '../shared/models/team-member';

@Component({
  selector: 'app-admin-panel-list',
  templateUrl: './admin-panel-list.component.html',
  styleUrls: ['./admin-panel-list.component.scss']
})
export class AdminPanelListComponent implements OnInit {
  members$ = new Observable<TeamMember[]>();

  constructor(private boardService: CsBoardService) { }

  ngOnInit(): void {
    this.members$ = this.boardService.getCsBoard();
  }

}
