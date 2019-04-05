import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contactgroups-detail',
  templateUrl: './contactgroups-detail.component.html',
  styleUrls: ['./contactgroups-detail.component.scss']
})
export class ContactgroupsDetailComponent implements OnInit {

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
