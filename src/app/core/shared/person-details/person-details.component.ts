import { Component, OnInit, Input } from '@angular/core';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { SharedService } from '../../services/shared.service';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoService } from '../../services/info.service';
import { ActivatedRoute } from '@angular/router';
import { Person } from '../../models/person';

@Component({
  selector: 'app-person-details',
  templateUrl: './person-details.component.html',
  styleUrls: ['./person-details.component.scss']
})
export class PersonDetailsComponent implements OnInit {
@Input()  personDetails: Person;
  constructor(private contactGroupService: ContactGroupsService,
    private sharedService: SharedService,
    private storage: StorageMap,
    private infoService: InfoService,
    private route: ActivatedRoute) { }

  ngOnInit() {
  }

}
