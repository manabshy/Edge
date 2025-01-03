import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core'
import { FormBuilder, FormGroup } from '@angular/forms'
import { Observable, EMPTY } from 'rxjs'
import { tap, catchError, distinctUntilChanged, switchMap, debounceTime } from 'rxjs/operators'
import { ContactGroup, Signer } from 'src/app/contact-groups/shared/contact-group.interfaces'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { PeopleService } from 'src/app/core/services/people.service'

@Component({
  selector: 'app-contact-group-finder',
  templateUrl: './contact-group-finder.component.html'
})
export class ContactGroupFinderComponent implements OnInit, OnChanges {
  @Input() label: string
  @Input() fullName: string
  @Input() isFull = false
  @Input() showCreateNewCompanyContact = true
  @Input() isSigner = false
  @Input() isSinglePerson: false
  @Output() selectedContactGroup = new EventEmitter<Signer>()
  @Output() fullSelectedContactGroup = new EventEmitter<ContactGroup>()
  @Output() isCreatingNewGroup = new EventEmitter<boolean>()
  contactGroupFinderForm: FormGroup
  noSuggestions: boolean
  suggestions: (text$: Observable<string>) => Observable<any[]>
  hasBeenSearched: boolean
  contactGroups: Signer[]
  suggestedTerm: ''
  searchTerm = ''

  constructor(
    private fb: FormBuilder,
    private contactGroupService: ContactGroupsService,
    private peopleService: PeopleService
  ) {}

  ngOnInit(): void {
    this.contactGroupFinderForm = this.fb.group({
      searchTerm: [''],
      selectedSigner: ['']
    })

    // console.log('here', this.searchTerm);
    // if (this.searchTerm) {
    //   this.getContactGroups(this.searchTerm);
    // }
    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        debounceTime(200),
        distinctUntilChanged(),
        switchMap((term) => this.getPeopleSuggestions(term))
      )
  }

  ngOnChanges() {
    if (this.fullName) {
      // this.searchTerm = this.fullName;
      this.getContactGroups(this.fullName)
    }
  }

  private getPeopleSuggestions(term: string): Observable<any[]> {
    return this.peopleService.getPeopleSuggestions(term).pipe(
      tap((data) => {
        if (data && !data.length) {
          this.noSuggestions = true
        } else {
          this.noSuggestions = false
        }
      }),
      catchError(() => {
        return EMPTY
      })
    )
  }

  getContactGroups(searchTerm: string) {
    this.contactGroupService.getAutocompleteSigners(searchTerm).subscribe(
      (result) => {
        this.hasBeenSearched = true
        if (this.isSinglePerson) {
          result = result.filter((x) => x.contactNames.match(',') == null)
        }
        this.contactGroups = result
        // console.log("contact groups here", this.contactGroups);
      },
      (error) => {
        this.contactGroups = []
        // this.isHintVisible = true;
      }
    )
  }

  getContactGroupDetails(contactGroupId: number) {
    this.contactGroupService.getContactGroupById(contactGroupId).subscribe((data) => {
      // console.log({ data });
      if (data) {
        this.fullSelectedContactGroup.emit(data)
      }
    })
  }

  selectedSuggestion(event: any) {
    if (event.item != null) {
      this.suggestedTerm = event.item
    }
    this.searchContactGroup()
    this.suggestedTerm = ''
  }

  searchContactGroup() {
    this.suggestedTerm
      ? (this.searchTerm = this.suggestedTerm)
      : (this.searchTerm = this.contactGroupFinderForm.get('searchTerm').value)
    this.getContactGroups(this.searchTerm)
  }

  selectContactGroup(contactGroup: Signer) {
    if (this.isFull) {
      this.getContactGroupDetails(contactGroup.contactGroupId)
    } else {
      this.selectedContactGroup.emit(contactGroup)
    }
  }

  createNewContactGroup() {}
}
