import { Component, OnInit, Input } from '@angular/core';
import { Dashboard, Tiles } from '../shared/dashboard';
@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  styleUrls: ['./my-dashboard.component.css']
})
export class MyDashboardComponent implements OnInit {
@Input() myDashboard: Dashboard;
@Input() period: string;
@Input() periodKey: string;
// @Input() valuationTile: Tiles;
// @Input() allInstructionsTile: Tiles;
// @Input() instructionsTile: Tiles;
// @Input() exchangesTile: Tiles;
// @Input() bddTile: Tiles;
// @Input() pipelineTile: Tiles;
// @Input() isValuation: boolean;
// @Input() isAllInstructions: boolean;
// @Input() isInstructions: boolean;
// @Input() isBdd: boolean;
// @Input() isExchanges: boolean;
// @Input() isPipeline: boolean;

valuationTile: Tiles = Tiles.Valuations;
bddTile: Tiles = Tiles.BusinessDevelopment;
allInstructionsTile: Tiles = Tiles.AllInstructions;
exchangesTile = Tiles.Exchanges;
pipelineTile = Tiles.Pipeline;
instructionsTile = Tiles.Instructions;

get valuations(): string {
 return this.valuationTile = Tiles.Valuations;
}
get allInstructions(): string{
 return this.allInstructionsTile = Tiles.AllInstructions;
}
get bdd(): string {
 return this.bddTile = Tiles.BusinessDevelopment;
}
get isValuation(): boolean {
 return this.valuationTile === Tiles.Valuations;
}
get isInstructions(): boolean {
 return this.instructionsTile === Tiles.Instructions;
}
get isAllInstructions(): boolean {
 return this.allInstructions === Tiles.AllInstructions;
}
get isBdd(): boolean {
 return this.bddTile === Tiles.BusinessDevelopment;
}
get isPipeline(): boolean {
 return this.pipelineTile === Tiles.Pipeline;
}
get isExchanges(): boolean {
 return this.exchangesTile === Tiles.Exchanges;
}

  constructor() { }

  ngOnInit() {
  }


}
