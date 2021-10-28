import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core'
import { ContactGroupsService } from 'src/app/contact-groups/shared/contact-groups.service'
import { Company, CompanyAutoCompleteResult } from 'src/app/contact-groups/shared/contact-group'
import { distinctUntilChanged, switchMap, tap, catchError } from 'rxjs/operators'
import { Observable, EMPTY } from 'rxjs'
import { Router } from '@angular/router'

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
        [existingIds]="existingIds"
        (companyName)="companyName.emit($event)"
        [canCreateNewCompany]="canCreateNewCompany"
        (searchCompanyEmitter)="findCompany($event)"
        (selectedCompanyDetails)="selectedCompanyDetails.emit($event)"
        (onManualEntry)="isManualEntry($event)"
      ></app-pure-company-finder-shell>
    </div>
  `
})
export class CompanyFinderComponent implements OnInit {
  @Input() companyNameError: any
  @Input() existingCompany?: Company
  @Input() canCreateNewCompany = false
  @Input() existingIds: string[]

  @Output() companyName = new EventEmitter<any>()
  @Output() selectedCompanyDetails = new EventEmitter<Company>()

  foundCompanies: CompanyAutoCompleteResult[]
  suggestions: (text$: Observable<string>) => Observable<any[]>
  noSuggestions = false
  hasBeenSearched = false

  constructor(private contactGroupService: ContactGroupsService, private router: Router) {}

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
            })
          )
        )
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

  isManualEntry(ev) {
    console.log('isManualEntry: ', ev)
    this.router.navigate(['/company-centre/detail/0/edit'], {
      queryParams: { isNewCompany: true, companyName: ev.companyName, backToOrigin: true }
    })
  }
}
