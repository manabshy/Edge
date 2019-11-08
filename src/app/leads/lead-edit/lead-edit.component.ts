import { Component, OnInit } from '@angular/core';
import { AppUtils } from '../../core/shared/utils';
import { ActivatedRoute } from '@angular/router';
import { LeadsService } from '../shared/leads.service';
import { Lead } from '../shared/lead';
import { StorageMap } from '@ngx-pwa/local-storage';
import { InfoDetail } from 'src/app/core/services/info.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { SharedService } from 'src/app/core/services/shared.service';

@Component({
  selector: 'app-lead-edit',
  templateUrl: '../lead-edit/lead-edit.component.html',
  styleUrls: ['../lead-edit/lead-edit.component.scss']
})
export class LeadEditComponent implements OnInit {

  listInfo: any;
  leadId: number;
  lead: Lead;
  leadTypes: InfoDetail[];
  leadEditForm: FormGroup;

  constructor(private leadsService: LeadsService,
    private route: ActivatedRoute,
    private storage: StorageMap,
    private fb: FormBuilder,
    private sharedService: SharedService) { }

  ngOnInit() {
    AppUtils.parentRoute = AppUtils.prevRoute;
    this.route.params.subscribe(params => {
      this.leadId = +params['leadId'] || 0;
    });

    this.setupLeadEditForm();

    this.leadsService.getLead(this.leadId).subscribe(result => {
            this.lead = result;
            this.leadEditForm.patchValue({
              owner: result.owner,
              person: result.person,
              leadTypes: result.leadType,
              nextChaseDate: this.sharedService.ISOToDate(result.createdDate)
            });
            console.log(result.createdDate);
            }, error => {
                          this.lead = null;
                        });

    this.storage.get('info').subscribe(data => {
      if (data) {
        this.listInfo = data;
        this.leadTypes = this.listInfo.leadTypes;
        console.log('loading lead types ....', this.leadTypes);
      }
    });
    console.log(AppUtils.parentRoute);
  }


  private setupLeadEditForm() {
    this.leadEditForm = this.fb.group({
      owner: '',
      person: '',
      leadType: '',
      nextChaseDate: ['']
    });
  }


}
