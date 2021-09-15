import { Component, OnInit } from "@angular/core";
import { FormGroup, FormBuilder, FormControl } from "@angular/forms";
import { Observable, EMPTY } from "rxjs";
import { ValuationService } from "./shared/valuation.service";
import {
  debounceTime,
  distinctUntilChanged,
  switchMap,
  catchError,
  takeUntil,
  tap
} from "rxjs/operators";
import {
  Valuation,
  ValuationStatuses,
} from "./shared/valuation";
import { WedgeError, SharedService } from "../core/services/shared.service";
import { StorageMap } from "@ngx-pwa/local-storage";
import { StaffMember, Office, RoleName } from "../shared/models/staff-member";
import { BaseComponent } from "../shared/models/base-component";
import { StaffMemberService } from "../core/services/staff-member.service";
import { OfficeService } from "../core/services/office.service";
import { format } from "date-fns";

@Component({
  selector: "app-valuations",
  templateUrl: "./valuations.component.html",
  styleUrls: ["./valuations.component.scss"],
})
export class ValuationsComponent extends BaseComponent implements OnInit {
  valuationFinderForm: FormGroup;
  valuations: Valuation[] = [];
  searchTerm = "";
  suggestedTerm = "";
  listerId = 0;
  officeId = 0;
  status = 0;
  isMessageVisible: boolean;
  isHintVisible: boolean;
  page: number;
  bottomReached = false;
  suggestions: (text$: Observable<any>) => Observable<any>;
  valuers: StaffMember[];
  valuersForSelect: Array<any> = [];
  offices: Office[] = [];
  statuses = ValuationStatuses;
  isAdvancedSearchVisible: boolean = false;
  queryResultCount: number;
  selectControlModels = {
    statusId: [],
    valuerId: [],
    officeId: []
  }
  currentStaffMember: StaffMember

  get searchTermControl() {
    return this.valuationFinderForm.get("searchTerm") as FormControl;
  }
  get dateControl() {
    return this.valuationFinderForm.get("date") as FormControl;
  }
  get statusControl() {
    return this.valuationFinderForm.get("statusId") as FormControl;
  }
  get valuerControl() {
    return this.valuationFinderForm.get("valuerId") as FormControl;
  }
  get officeControl() {
    return this.valuationFinderForm.get("officeId") as FormControl;
  }

  public keepOriginalOrder = (a) => a.key;

  constructor(
    private valuationService: ValuationService,
    private sharedService: SharedService,
    private staffMemberService: StaffMemberService,
    private officeService: OfficeService,
    private storage: StorageMap,
    private fb: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    this.setupForm();
    this.getValuers();
    this.setPage();
    this.setSuggestions();
    this.getOffices();
    this.getCurrentStaffMember();
   }

  public getValuations() {
    this.page = 1;
    this.bottomReached = false;
    this.valuations = [];
    this.suggestedTerm
      ? (this.searchTerm = this.suggestedTerm)
      : (this.searchTerm = this.searchTermControl.value);
    this.getNextValuationsPage(this.page);
  }

  getNextValuationsPage(page: number) {
    const request = {
      page: page,
      searchTerm: this.searchTerm,
      date:
        this.dateControl.value === null
          ? null
          : format(this.dateControl.value, "yyyy-MM-dd"),
      status: this.selectControlModels.statusId,
      valuerId: this.selectControlModels.valuerId,
      officeId: this.selectControlModels.officeId,
    };

    this.valuationService
      .getValuations(request)
      .pipe(
        tap((res) => console.log("res", res)),
        distinctUntilChanged()
      )
      .subscribe(
        (result) => {
          if (this.searchTerm && this.searchTerm.length) {
            if (result && !result.length) {
              this.isMessageVisible = true;
              this.bottomReached = true;
            } else {
              this.isMessageVisible = false;
            }
          }
          if (result && result.length) {
            this.queryResultCount = result[0].queryResultCount;
            if (request.page === 1) {
              this.isAdvancedSearchVisible = false;
              this.valuations = result;
            } else {
              this.valuations = this.valuations.concat(result);
            }
          } else {
            this.queryResultCount = 0;
          }
        },
        (error: WedgeError) => {
          this.valuations = [];
          this.searchTerm = "";
          this.isHintVisible = true;
        }
      );
  }

  suggestionSelected(event) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
      console.log("suggestion", this.suggestedTerm);
    }
    this.getValuations();
    this.suggestedTerm = "";
  }

  getSelectedOfficeId(id: number) {
    this.officeControl.setValue(id);
  }

  getSelectedStaffMemberId(id: number) {
    console.log("valuer id here", id);
    this.valuerControl.setValue(id);
  }

  scrollElIntoView(className: string) {
    this.sharedService.scrollElIntoView(className);
  }

  selectionControlChange(fieldId, ev) {
    console.log('selectionControlChanged', fieldId, ev)
    this.valuationFinderForm.patchValue({
      [fieldId]: ev
    })
    this.selectControlModels[fieldId] = ev
    console.log('this.valuationFinderForm: ', this.valuationFinderForm)
    console.log('this.selectControlModels[fieldId]: ', this.selectControlModels[fieldId])
  }

  // PRIVATE
  private setPage(){
    this.valuationService.valuationPageNumberChanges$
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((newPageNumber) => {
      this.page = newPageNumber;
      this.getNextValuationsPage(this.page);
      console.log("%c HEYYYY", "color: blue", this.page);
    });
  }

  private setSuggestions(){
    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) =>
          this.valuationService.getValuationSuggestions(term).pipe(
            catchError(() => {
              return EMPTY;
            })
          )
        )
      );
  }

  private getCurrentStaffMember(){
    this.staffMemberService.getCurrentStaffMember().toPromise()
    .then(res => {
      this.currentStaffMember = res
      console.log('currentStaffMember:', this.currentStaffMember)    
      this.setInitialFilters();
      this.getValuations();
    })
  }

  private getValuers(){
    this.storage.get("activeStaffmembers").subscribe((data) => {
      if (data) {
        this.valuers = data as StaffMember[];
        this.setValuersForSelectControl() // maps valuers to object for generic select control to use US278
      } else {
        this.staffMemberService
          .getActiveStaffMembers()
          .pipe(takeUntil(this.ngUnsubscribe))
          .subscribe((result) => {
            this.valuers = result
            this.setValuersForSelectControl() // maps valuers to object for generic select control to use US278
          });
      }
    });
  }

  private getOffices() {
    this.officeService.getOffices().toPromise()
      .then(res => {
        this.offices = res.result.map(office => {
          return {
            id: office.officeId,
            value: office.name
          }
        })
      })
  }

  private setValuersForSelectControl() {
    this.valuersForSelect = this.valuers.map(valuer => {
      return {
        id: valuer.staffMemberId,
        value: valuer.fullName
      }
    })
  }

  private setupForm() {
    this.valuationFinderForm = this.fb.group({
      searchTerm: "",
      date: null,
      statusId: [0],
      valuerId: [0],
      officeId: [0],
    });
  }

  private setInitialFilters(){
    this.setInitialStatusId()
    this.setInitialValuerId()
    this.setInitialOfficeId()
  }

  private setInitialStatusId(){
    this.selectControlModels.statusId = [2,3] // Booked, Valued. Default for all users
  }
  
  private setInitialValuerId(){
    if(this.currentStaffMember.roles && this.currentStaffMember.roles.length){
      if(this.isManager() || this.isBroker()){
        this.selectControlModels.valuerId = [this.currentStaffMember.staffMemberId]
        } else {
          this.selectControlModels.valuerId = []
        }
    }
  }

  isManager():boolean{
    if (this.currentStaffMember.roles.findIndex(x=> x.roleName === RoleName.Manager) >-1){
      return true;
    }
    return false;
  }

  isBroker():boolean{
    if (this.currentStaffMember.roles.findIndex(x=> x.roleName === RoleName.Broker) >-1){
      return true;
    }
    return false;
  }

  isOfficeManager():boolean{
    if (this.currentStaffMember.roles.findIndex(x=> x.roleName === RoleName.OfficeManager) >-1){
      return true;
    }
    return false;
  }

  private setInitialOfficeId(){
 
    if(this.isOfficeManager()){
      this.selectControlModels.officeId = [this.currentStaffMember.officeId]
    } else {
     this.selectControlModels.officeId = []
    }
  }
  

}
