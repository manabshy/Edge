import { Component, OnInit, Input } from '@angular/core';
import { AppConstants } from 'src/app/core/shared/app-constants';
import { Instruction, Valuation } from '../../shared/dashboard';

@Component({
  selector: 'app-valuations-and-instructions',
  templateUrl: './valuations-and-instructions.component.html',
  styleUrls: ['./valuations-and-instructions.component.scss']
})
export class ValuationsAndInstructionsComponent implements OnInit {
@Input() selectedPeriod: string;
@Input() period: string;
@Input() periodList: any;
@Input() instructions: Instruction[];
@Input() valuations: Valuation[];
@Input() isValuations: boolean;
@Input() isBdd: boolean;
@Input() isInstructions: boolean;
@Input() tileNames: string;


  constructor() { }

  ngOnInit() {
  }

}
