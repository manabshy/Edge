import { Component, OnInit, Input } from '@angular/core';
import { Instruction } from '../../shared/dashboard';

@Component({
  selector: 'app-instructions-and-business-development',
  templateUrl: './instructions-and-business-development.component.html',
  styleUrls: ['./instructions-and-business-development.component.scss']
})
export class InstructionsAndBusinessDevelopmentComponent implements OnInit {
@Input() period: string;
@Input() allInstructions: Instruction[];
  constructor() { }

  ngOnInit() {
    console.log('this is all instructions from bdd and instructions', this.allInstructions);
  }

}
