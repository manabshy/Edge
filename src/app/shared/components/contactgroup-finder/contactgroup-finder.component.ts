import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable, EMPTY } from 'rxjs';
import { tap, catchError, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { BasicContactGroup, ContactGroup, Signer } from 'src/app/contactgroups/shared/contact-group';
import { ContactGroupsService } from 'src/app/contactgroups/shared/contact-groups.service';
import { PeopleService } from 'src/app/core/services/people.service';
import { SignerComponent } from '../../signer/signer.component';

@Component({
  selector: 'app-contactgroup-finder',
  templateUrl: './contactgroup-finder.component.html',
  styleUrls: ['./contactgroup-finder.component.scss']
})
export class ContactgroupFinderComponent implements OnInit, OnChanges {
  @Input() label: string;
  @Input() fullName: string;
  @Input() isFull = false;
  @Input() showCreateNewCompanyContact = true;
  @Input() isSigner = false;
  @Output() selectedContactGroup = new EventEmitter<Signer>();
  @Output() fullSelectedContactGroup = new EventEmitter<ContactGroup>();
  @Output() isCreatingNewGroup = new EventEmitter<boolean>();
  contactGroupFinderForm: FormGroup;
  noSuggestions: boolean;
  suggestions: (text$: Observable<string>) => Observable<any[]>;
  hasBeenSearched: boolean;
  contactGroups: Signer[];
  suggestedTerm: '';
  searchTerm = '';

  constructor(private fb: FormBuilder,
    private contactGroupService: ContactGroupsService, private peopleService: PeopleService) { }

  ngOnInit(): void {
    this.contactGroupFinderForm = this.fb.group({
      searchTerm: [''],
      selectedSigner: [''],
    });

    // console.log('here', this.searchTerm);
    // if (this.searchTerm) {
    //   this.getContactGroups(this.searchTerm);
    // }
    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap(term =>
          this.getPeopleSuggestions(term)
        )
      );
  }

  ngOnChanges() {
    if (this.fullName) {
      // this.searchTerm = this.fullName;
      this.getContactGroups(this.fullName);
    }
  }

  private getPeopleSuggestions(term: string): Observable<any[]> {
    return this.peopleService.getPeopleSuggestions(term).pipe(tap(data => {
      if (data && !data.length) {
        this.noSuggestions = true;
      } else {
        this.noSuggestions = false;
      }
    }), catchError(() => {
      return EMPTY;
    }));
  }

  getContactGroups(searchTerm: string) {
    this.contactGroupService.getAutocompleteSigners(searchTerm).subscribe((result) => {
      this.hasBeenSearched = true;
      this.contactGroups = result;
      console.log('contact groups here', this.contactGroups);
    }, error => {
      this.contactGroups = [];
      // this.isHintVisible = true;
    });
  }


  getContactGroupDetails(contactGroupId: number) {
    this.contactGroupService.getContactGroupbyId(contactGroupId).subscribe(data => {
      console.log({ data });

      if (data) { this.fullSelectedContactGroup.emit(data); }
    });
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item;
    }
    this.searchContactGroup();
    this.suggestedTerm = '';
  }

  searchContactGroup() {
    this.suggestedTerm ? this.searchTerm = this.suggestedTerm : this.searchTerm = this.contactGroupFinderForm.get('searchTerm').value;
    this.getContactGroups(this.searchTerm);
  }

  selectContactGroup(contactGroup: Signer) {
    if (this.isFull) {
      this.getContactGroupDetails(contactGroup.contactGroupId);
    } else {
      this.selectedContactGroup.emit(contactGroup);
    }
  }
  
  createNewContactGroup() { }

}