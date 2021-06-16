import { StaffMember } from "src/app/shared/models/staff-member";
import { Component, OnInit, Input } from "@angular/core";
import { Dashboard, Tiles } from "../shared/dashboard";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { StorageMap } from "@ngx-pwa/local-storage";
import { StaffMemberService } from "src/app/core/services/staff-member.service";
import { FormErrors } from "src/app/core/shared/app-constants";
@Component({
  selector: "app-targets",
  templateUrl: "./targets.component.html",
  styleUrls: ["./targets.component.scss"],
})
export class TargetsComponent implements OnInit {
  selectedMember: StaffMember;
  selectedGroup = "You";
  targetsForm: FormGroup;
  formErrors = FormErrors;

  groupNameNeg = "Negotiator";
  groupNameBroker = "Broker";
  groupNameManager = "Manager";
  groupNameAd = "AD";
  groupNameYou = "You";

  constructor(
    private fb: FormBuilder,
    private _router: Router,
    private route: ActivatedRoute,
    private storage: StorageMap,
    private staffMemberService: StaffMemberService
  ) {
    // this.route.params.subscribe((params) => {
    // this.contactGroupId = +params["contactGroupId"] || 0;
    // this.groupPersonId = +params["groupPersonId"] || 0;
    // this.personId = +params["personId"] || 0;
    // if (this.personId) {
    //   this.getContactGroupFirstPerson(this.personId, false);
    // }
    // });
  }

  ngOnInit() {
    this.getCurrentUserInfo();

    this.targetsForm = this.fb.group({
      targetLeads: ["", [Validators.min(0)]],
      callsDay: [""],
      callsWeek: [""],
      callsMonth: [""],
      callsQuarter: [""],
      callsYear: [""],
      valuationsDay: [""],
      valuationsWeek: [""],
      valuationsMonth: [""],
      valuationsQuarter: [""],
      valuationsYear: [""],
      instructionsDay: [""],
      instructionsWeek: [""],
      instructionsMonth: [""],
      instructionsQuarter: [""],
      instructionsYear: [""],
      referralsDay: [""],
      referralsWeek: [""],
      referralsMonth: [""],
      referralsQuarter: [""],
      referralsYear: [""],
    });
  }

  selectGroup(group: string) {
    this.selectedGroup = group;
  }

  private getCurrentUserInfo() {
    this.storage.get("currentUser").subscribe((data: StaffMember) => {
      if (data) {
        this.selectedMember = data;
      } else {
        this.staffMemberService
          .getCurrentStaffMember()
          .subscribe((res) => (this.selectedMember = res));
      }
    });
  }

  SaveTargets() {}
}
