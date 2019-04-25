import { Component, OnInit, Input } from '@angular/core';
import { Dashboard, Tiles } from '../shared/dashboard';
import {RoundingPipe} from '../../core/shared/rounding.pipe';
@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
@Input() myDashboard: Dashboard;
@Input() period: string;
@Input() periodKey: string;
@Input() valuationTile: Tiles;
@Input() isValuation: boolean;

  constructor() { }

  ngOnInit() {
  }


}
