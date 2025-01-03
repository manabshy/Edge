import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamMember } from '../shared/models/team-member';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-admin-panel-list',
  templateUrl: './admin-panel-list.component.html',
  styleUrls: ['./admin-panel-list.component.scss']
})
export class AdminPanelListComponent implements OnInit {
  @Input() members: TeamMember[];
  @Output() showRules = new EventEmitter<boolean>();
  @Output() selectedMember = new EventEmitter<TeamMember>();
  constructor() { }

  ngOnInit(): void {
  }
}
