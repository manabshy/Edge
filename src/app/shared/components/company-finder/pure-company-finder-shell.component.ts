import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core'
import { Company } from 'src/app/contact-groups/shared/contact-group'

// The pure component is neat and tidy with minimal code and dependencies. This makes it easier to develop alongside Storybook.

@Component({
  selector: 'app-pure-company-finder-shell',
  templateUrl: './pure-company-finder-shell.component.html',
})
export class PureCompanyFinderShellComponent implements OnInit {
  @Input() searchResults: Company[]
  @Input() existingCompany?: Company
  @Input() companyNameError: String
  @Input() canCreateNewCompany: Boolean
  @Input() hasBeenSearched: Boolean
  @Input() noSuggestions: Boolean
  @Input() suggestions: any
  @Input() companyFinderForm: any
  @Output() selectCompany = new EventEmitter<Company>()
  @Output() selectedSuggestion = new EventEmitter<Company>()
  @Output() isManualEntry = new EventEmitter<boolean>()
  @Output() createNew = new EventEmitter<boolean>()
  @Output() searchCompany = new EventEmitter<any>()

  ngOnInit() {
    console.log('pure-company-finder-shell')
  }
}
