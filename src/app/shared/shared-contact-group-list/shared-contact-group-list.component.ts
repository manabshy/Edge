import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BasicContactGroup, ContactGroup } from 'src/app/contact-groups/shared/contact-group.interfaces';

@Component({
  selector: 'app-shared-contact-group-list',
  templateUrl: './shared-contact-group-list.component.html',
  styleUrls: ['./shared-contact-group-list.component.scss']
})
export class SharedContactGroupListComponent implements OnInit {
  @Input() contactGroups: BasicContactGroup[];
  @Input() personId: number;
  constructor(private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }


  navigateTo(path: any) {
    this.router.navigate(path, { relativeTo: this.route, queryParams: { showNotes: true, backToOrigin: true } });
  }

}
