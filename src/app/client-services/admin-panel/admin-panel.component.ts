import { Component, OnDestroy, OnInit } from '@angular/core';
import { StorageMap } from '@ngx-pwa/local-storage';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TeamMembers } from 'src/testing/admin-panel-data';
import { TeamMember } from '../shared/models/team-member';
import { CsBoardService } from '../shared/services/cs-board.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit, OnDestroy {
  members$ = new Observable<TeamMember[]>();
  selectedMember: TeamMember;
  showRules = false;
  members: TeamMember[];
  constructor(private boardService: CsBoardService, private storage: StorageMap) { }

  ngOnInit(): void {
    this.getBoard();
    // this.boardService.getCsBoard().subscribe((data)=>{this.members = data; this.selectedMember=data[0]});
  }

   getBoard() {
    this.members$ = this.boardService.getCsBoard()
      .pipe(tap(data => {
        this.selectedMember = data[0];
        console.log('selected ', data[0]);
        this.members = data;
        this.storage.set('adminPanelBoard', data).subscribe();
      }));
  }

  getSelectedMember(member: TeamMember, source?: string) {
    if (source === 'list') {
      this.selectedMember = member;
    } else { this.selectedMember.totalPoints = member.totalPoints; }
    this.updateBoardFromStorage();
  }

  updateSelectedMember(member: TeamMember) {
    this.selectedMember = member; console.log({ member }, 'updated');
  }

  updateBoardFromStorage() {
    this.storage.get('adminPanelBoard').subscribe((data: TeamMember[]) => {
      if (data?.length) { { this.members$ = of(data); } }
    });
  }

  ngOnDestroy() { this.storage.delete('adminPanelBoard').subscribe(); }

}
