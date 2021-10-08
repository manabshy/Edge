import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core'
// import { FormGroup, FormBuilder, Validators, FormControlName, FormControl } from '@angular/forms'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { Company, CompanyAutoCompleteResult } from 'src/app/contact-groups/shared/contact-group'
import { distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators'
import { Observable, EMPTY } from 'rxjs'

@Component({
  selector: 'app-company-finder',
  template: `
    <div>
      <app-pure-company-finder-shell
        [searchResults]="foundCompanies"
        [existingCompany]="existingCompany"
        [hasBeenSearched]="hasBeenSearched"
        [noSuggestions]="noSuggestions"
        [suggestions]="suggestions"
        [companyNameError]="companyNameError"
        (companyName)="companyName.emit($event)"
        (searchCompanyEmitter)="findCompany($event)"
        (selectedCompanyDetails)="selectedCompanyDetails.emit($event)"
      ></app-pure-company-finder-shell>
    </div>
  `,
})
export class CompanyFinderComponent implements OnInit, OnDestroy {
  @Input() companyNameError: any
  @Input() existingCompany?: Company
  @Input() canCreateNewCompany = false

  @Output() companyName = new EventEmitter<any>()
  @Output() selectedCompanyDetails = new EventEmitter<Company>()
  @Output() isManualEntry = new EventEmitter<boolean>()

  foundCompanies: CompanyAutoCompleteResult[]
  suggestions: (text$: Observable<string>) => Observable<any[]>
  noSuggestions = false
  hasBeenSearched = false

  constructor(private contactGroupService: ContactGroupsService) {}

  ngOnInit() {
    this.suggestions = (text$: Observable<string>) =>
      text$.pipe(
        distinctUntilChanged(),
        switchMap((term) =>
          this.contactGroupService.getCompanySuggestions(term).pipe(
            tap((data) => {
              if (data && !data.length) {
                this.noSuggestions = true
              } else {
                this.noSuggestions = false
              }
            }),
            catchError(() => {
              return EMPTY
            }),
          ),
        ),
      )
  }

  findCompany(searchTerm: any) {
    this.contactGroupService.getAutocompleteCompany(searchTerm).subscribe((data) => {
      this.hasBeenSearched = true
      this.foundCompanies = data
      this.checkDuplicateCompanies(searchTerm)
    })
  }

  private checkDuplicateCompanies(companyName: string) {
    const matchedCompanies = []
    if (this.foundCompanies && companyName.length) {
      this.foundCompanies.forEach((x) => {
        const sameCompanyName = x.companyName.toLowerCase() === companyName.toLowerCase()
        if (sameCompanyName) {
          x.matchScore = 10
        }
        matchedCompanies.push(x)
      })
      this.foundCompanies = matchedCompanies
    }
  }

  ngOnDestroy() {
    console.log('destroyed')
  }
}
