import { Component, OnInit,ElementRef, Input } from '@angular/core';

@Component({
  selector: 'app-property-checklist-item',
  templateUrl: './property-checklist-item.component.html',
  styleUrls: ['./property-checklist-item.component.css']
})
export class PropertyChecklistItemComponent implements OnInit {

  constructor(private el: ElementRef) { }

  ngOnInit() {
  }
  
  @Input() title: string;
  @Input() statusColor: string;
  @Input() staffMember: string;
  @Input() date: string;

}
