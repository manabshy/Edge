import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { Observable } from 'rxjs';
import { InstructionInfo } from '../shared/property';

@Component({
  selector: 'app-property-detail-instructions',
  templateUrl: './property-detail-instructions.component.html',
  styleUrls: ['./property-detail-instructions.component.scss']
})
export class PropertyDetailInstructionsComponent implements OnInit {
propertyId: number;
instructions$ = new Observable<InstructionInfo[]>();

  constructor(private route: ActivatedRoute, private propertyService: PropertyService) { }

  ngOnInit() {
   this.propertyId = +this.route.snapshot.paramMap.get('id') || 0;
   if (this.propertyId) {
    this.instructions$ = this.propertyService.getPropertyInstructions(this.propertyId);
   }
  }

}
