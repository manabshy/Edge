import { Component, OnInit } from '@angular/core';
import { CsBoardService } from '../shared/services/cs-board.service';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TeamMember } from '../shared/models/team-member';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-admin-panel-list',
  templateUrl: './admin-panel-list.component.html',
  styleUrls: ['./admin-panel-list.component.scss']
})
export class AdminPanelListComponent implements OnInit {
  members$ = new Observable<TeamMember[]>();

  constructor(private boardService: CsBoardService, private sharedService: SharedService) { }

  ngOnInit(): void {
    this.members$ = this.boardService.getCsBoard().pipe(catchError((err) => { this.sharedService.showError(err); return EMPTY }));
  }
}
