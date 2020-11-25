import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicContactGroup, ContactGroup } from 'src/app/contactgroups/shared/contact-group';

@Component({
  selector: 'app-shared-contactgroup-list',
  templateUrl: './shared-contactgroup-list.component.html',
  styleUrls: ['./shared-contactgroup-list.component.scss']
})
export class SharedContactgroupListComponent implements OnInit {
  @Input() contactGroups: BasicContactGroup[];
  @Input() personId: number;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }


  navigateTo(path: any) {
    this.router.navigate(path, { relativeTo: this.route, queryParams: { showNotes: true } });
  }

}
