import { Component, OnInit } from '@angular/core';
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
export class AdminPanelComponent implements OnInit {
  members$ = new Observable<TeamMember[]>();
  selectedMember: TeamMember;
  showRules = false;
  members: TeamMember[];
  constructor(private boardService: CsBoardService) { }

  ngOnInit(): void {
    console.log('here');

    this.members$ = this.boardService.getCsBoard().pipe(tap(data => { this.selectedMember = data[0]; console.log('selected ', data[0]); this.members = data }));
    // this.boardService.getCsBoard().subscribe((data)=>{this.members = data; this.selectedMember=data[0]});
  }

  getSelectedMember(member: TeamMember) {
    this.selectedMember = member;
    console.log({ member }, this.selectedMember, 'all members', this.members);
  }
  
  updateSelectedMember(member: TeamMember) {
    this.selectedMember = member; console.log({ member }, 'updated');
  }


}
